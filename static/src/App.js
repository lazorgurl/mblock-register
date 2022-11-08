import { useState, useEffect } from 'react';

const App = () => {
   const [domains, setDomains] = useState([]);
   const [search, setSearch] = useState([]);

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
      <div className='container'>
         <section class="hero">
            <div class="hero-body">
               <p class="title">
                  Mblock
               </p>
               <p class="subtitle">
                  Blocklist automation for Mastodon
               </p>
            </div>
         </section>
         <br />
         <div class="columns">
            <div class="column is-one-fifth">
               <article class="message">
                  <div class="message-header">
                     <p>Want to use mblock?</p>
                  </div>
                  <div class="message-body">
                     Check out the <a href="https://github.com/lazorgurl/mblock">Github repo</a> for instructions!
                  </div>
               </article>
            </div>
            <div class="column is-three-fifths">
            </div>
            <div class="column is-one-fifth">
               <label className='label'>Search</label>
               <input className="input" type="text" placeholder="Search domains" onChange={e => setSearch(e.target.value)} />
               <br />
               <br />
               <a href="https://mblock.toot.lgbt/domains">View JSON</a>
            </div>
         </div>
         <section>
         </section>
         <table className="table is-hoverable is-bordered">
            <thead>
               <tr>
                  <th><strong>Domain</strong></th>
                  <th><strong>Comment</strong></th>
               </tr>
            </thead>
            <tbody>
               {Object.entries(domains).filter(e => { return e[0].startsWith(search); }).map(e => {
                  return <tr><td>{e[0]}</td><td>{e[1]['comment']}</td></tr>;
               })}
            </tbody>
         </table>
      </div>
   );
};

export default App;
