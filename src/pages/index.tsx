import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

interface ImageData {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface ImagesApiResponse{
  data: ImageData[];
  after: number | null;
}

export default function Home(): JSX.Element {

  async function listImages({pageParam = null}){
    const { data } = await api.get<ImagesApiResponse>(`/api/images`, {
      params: {
        after: pageParam,
      },
    });    
    
    console.log('API.GET',data)
    return data
  }

  let teste = listImages({pageParam : null})
  
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    listImages,{
      getNextPageParam: lastPage => lastPage?.after || null
    });
  

  const formattedData = useMemo(() => {
    return data?.pages.map(obj => obj.data).flat();
  },[data]);


  // TODO RENDER LOADING SCREEN

  // TODO RENDER ERROR SCREEN

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {/* TODO RENDER LOAD MORE BUTTON IF DATA HAS NEXT PAGE */}
      </Box>
    </>
  );
}
