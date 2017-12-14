import * as Docker from 'dockerode'
import { pack } from 'tar-fs'

const docker = new Docker({
  socketPath: '/var/run/docker.sock'
})

const fullPath = path => path.replace('~', '/Users/antho')

const clientInfo = async () => docker.swarmInspect()

const allNetworks = async stack => docker
  .listNetworks({ filters: {
    scope: ['swarm'],
    label: [`com.docker.stack.namespace=${stack}`]
  } })

const allServices = async stack => docker
  .listServices({ filters: {
    label: [`com.docker.stack.namespace=${stack}`]
  } })

const stopService = async id => docker.getService(id).remove()

const createService = async (stack, name, config) => docker
  .createService({
    Name: [stack, name].join('_'),
    Labels: {
      'com.docker.stack.image': config.image,
      'com.docker.stack.namespace': stack
    },
    TaskTemplate: {
      ContainerSpec: {
        Image: config.image.indexOf(':') >= 0
          ? config.image
          : config.image + ':latest',
        Args: config.command
          ? Array.isArray(config.command)
            ? config.command
            : config.command.split(' ')
          : null,
        Labels: {
          'com.docker.stack.namespace': stack
        },
        Privileges: {
          CredentialSpec: null,
          SELinuxContext: null
        },
        Mounts: (config.volumes || [])
          .map(volume => ({
            Source: fullPath(volume.split(':')[0]),
            Target: volume.split(':').reverse()[0],
            Type: 'bind'
          })),
      },
      Resources: {},
      Placement: {},
      Networks: [{
        Target: config.networkId,
        Aliases: [name]
      }]
    },
    Mode: {
      Replicated: {
        Replicas: 1
      }
    },
    EndpointSpec: {
      Ports: (config.ports || [])
        .map(port => ({
          Protocol: "tcp",
          PublishMode: 'ingress',
          PublishedPort: parseInt(port.split(':')[0], 10),
          TargetPort: parseInt(port.split(':').reverse()[0], 10)
        }))
    }
  })

const buildImage = async (path, name) => {
  return docker.buildImage(pack(process.cwd() + path.replace(/\./, '')), { t: name })
}

export default {
  swarm: {
    info: clientInfo
  },
  networks: {
    all: allNetworks
  },
  services: {
    all: allServices,
    create: createService,
    stop: stopService
  },
  images: {
    build: buildImage
  }
}