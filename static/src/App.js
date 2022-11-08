import { useState, useEffect } from 'react';

const App = () => {
   const [domains, setDomains] = useState([]);

   useEffect(() => {
      fetch('https://mblock.toot.lgbt/domains')
         .then((res) => res.json())
         .then((data) => {
            console.log(data)
            setDomains(data);
         })
         .catch((err) => {
            console.log(err.message);
         });
   }, []);

   return (
    <div>
      
    </div>
   );
};

export default App;
