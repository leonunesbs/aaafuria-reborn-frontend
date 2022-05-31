import { useEffect } from 'react';
import { useRouter } from 'next/router';

function IntermedNordeste() {
  const router = useRouter();
  useEffect(() => {
    router.push('http://intermednordeste.com/login');
  }, [router]);
  return <h1>IntermedNordeste</h1>;
}

export default IntermedNordeste;
