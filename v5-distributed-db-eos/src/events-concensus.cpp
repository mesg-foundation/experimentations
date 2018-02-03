#include <event-concensus.hpp>

extern "C" {

    void init()  {
       eosio::print( "Init World!\n" );
    }

    void apply( uint64_t code, uint64_t action ) {
       eosio::print( "Hello World: ", eosio::name(code), "->", eosio::name(action), "\n" );
    }

}
