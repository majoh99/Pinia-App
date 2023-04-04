import { computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useQuery } from '@tanstack/vue-query';

import clientsApi from '@/api/clients-api';
import { useClientStore } from '@/store/clients';

import type { Client } from '@/clients/interfaces/client';

const getClients = async( page: number ):Promise<Client[]> => {
  
  // await new Promise( resolve => {
  //   setTimeout( () => resolve(true), 2500 );
  // });
  
  const { data } = await clientsApi.get<Client[]>(`/clients?_page=${ page }`);
  return data;
}

const useClients = () => {

  const store = useClientStore();
  
  const { currentPage, clients, totalPages } = storeToRefs( store );
  
   const { isLoading, data } = useQuery(
    ['clients?page=', currentPage],
    () => getClients( currentPage.value ),
    {
      // staleTime: 1000 * 60,
    }
   );

  watch( data, clients => {
    if( clients )
      store.setClients( clients );
  }, { immediate: true });

  return {
    // Properties
    clients,
    currentPage,
    isLoading,
    totalPages,

    // Methods
    getPage( page: number ){
      store.setPage( page );
    },

    // Getters
    // totalPageNumbers: computed(
    //   () => [...new Array( totalPages.value )].map( (v, i) => i + 1)
    // ),
  }
}

export default useClients;