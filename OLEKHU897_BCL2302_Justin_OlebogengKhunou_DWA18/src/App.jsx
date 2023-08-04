import React from 'react'
import SignIn from './components/SignIn';
import Preview from './components/Preview';
import Season from './components/Season'
import Episodes from './components/Episodes';
import Favorites from './components/Favourites';
import History from './components/History';
import Carousel from './components/Carousel ';
import { supabase } from './components/SignIn';

function App() {
  
  const [userLogIn, setUserLogIn] = React.useState('NoneUserLoggedIn')
  const [search, setSearch] = React.useState('');
  const [showDescription, setShowDescription] =React.useState();
  const [showImage, setShowImage] = React.useState();
  const [phase, setPhase] = React.useState('signUpPhase')
  const [phaseState, setPhaseState] = React.useState({
    Preview: [],
    searchPreview: [],
    Season: '',
    Episode: ''
  });
  const [favourite, setFavourite] = React.useState({
    favouriteShowTitle: '',
    favouriteSeasonTitle: '',
  });

   const genres = ['Personal Growth','True Crime and Investigative Journalism','History',
 'Comedy', 'Entertainment', 'Business', 'Fiction', 'News', 'Kids and Family'
]


  function HandleSearch(event) {
    setSearch(event.target.value);
  }


  React.useEffect(() => {
    const authListener = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        //  console.log("User signed in successfully:", session.user.email);
         setUserLogIn(session.user.email)
        setPhase('startPhase')
      }
    });

   
    return () => {
      authListener.unsubscribe;
    };
  }, []);

  React.useEffect(() => {
    fetch("https://podcast-api.netlify.app/shows")
      .then(res => res.json())
      .then(data => {
        if (phase === 'startPhase') {
          setPhaseState(prevState => ({
            ...prevState,
            Preview: data
          }))
          setPhase('previewPhase')
          setPhaseState(prevState => ({
            ...prevState,
            searchPreview: data
          }))
        }
      })
  }, [phase])


  async function HandlePreviewClick(event) {
    if (phase === 'previewPhase') {
      const buttonId = event.currentTarget.id
      const showTitle = event.currentTarget.title
      const showDescript = event.currentTarget.value
      const showButtonImage =  event.currentTarget.getAttribute('data-image')
      if (buttonId) {
        try {
          const response = await fetch(`https://podcast-api.netlify.app/id/${buttonId}`);
          const data = await response.json();
          setPhaseState(prevState => ({
            ...prevState,
            Season: data.seasons
          }))
          setFavourite(prevState => ({
            ...prevState,
           favouriteShowTitle: showTitle
          }))
          setShowDescription(showDescript)
          setShowImage(showButtonImage)
          setPhase('seasonPhase')
        } catch (error) {
          console.error('Error fetching Preview data:', error.message);
        }
      }
    }
  }

  function HandleSeasonClick(event) {
    if (phase === 'seasonPhase') {
      const seasonButtonId = event.currentTarget.id
      const seasonTitle = event.currentTarget.title
      if (seasonButtonId) {
        try {
          const seasonArray = phaseState.Season[seasonButtonId].episodes
          setPhaseState(prevState => ({
            ...prevState,
            Episode: seasonArray
          }))
          setFavourite(prevState => ({
            ...prevState,
           favouriteSeasonTitle: seasonTitle
          }))
          setPhase('episodePhase')
        } catch (error) {
          console.error('Error fetching Preview data:', error.message);
        }
      }
    }
  }

  //Audio play
  const [audioPlaying, setaudioPlaying] = React.useState(
    {
      title: "",
      audio: null
    }
  );

  function HandleAudioPlay(event) {
    const audioToPlay = event.target.id
    const audioTitle = event.target.title
    
    setaudioPlaying(prev => ({
      ...prev,
      audio: audioToPlay 
    }))
    setaudioPlaying(prev => ({
      ...prev,title: audioTitle
  }))
}

  function HandleMiniPlayClose() {
    setaudioPlaying(prevA => ({
      ...prevA,
      audio: null, title: null
    }))
  }

  
  const FilteredElements = phaseState.Preview.filter((show) => show.title.toLowerCase().includes(search.toLowerCase()));

  function SortByGender(event){
    const selectedGenre = event.target.value
    setPhaseState(prevPhase => ({
      ...prevPhase,
      Preview: phaseState.searchPreview.filter(show => { show.genres.some(genre => selectedGenre.includes(genre))
      })
    }))
  }
  function sortByAscending() {
    setPhaseState(prevPhase => ({
      ...prevPhase,
      Preview: phaseState.Preview.sort((a, b) => a.title.localeCompare(b.title))
    }))
  }
  function sortByDescending() {
    setPhaseState(prevPhase => ({
      ...prevPhase,
      Preview: phaseState.Preview.sort((a, b) => b.title.localeCompare(a.title))
    }))
  }
  function sortByLatest() {
    setPhaseState(prevPhase => ({
      ...prevPhase,
      Preview: phaseState.Preview.sort((a, b) => new Date(b.updated) - new Date(a.updated))
    }))
  }
  function sortByOldest() {
    setPhaseState(prevPhase => ({
      ...prevPhase,
      Preview: phaseState.Preview.sort((a, b) => new Date(a.updated) - new Date(b.updated))
    }))
  }

  function HandleBack() {
    if (phase === "seasonPhase") {
      setPhase('previewPhase')
    }
    else if (phase === 'episodePhase') {
      setPhase('seasonPhase')
    }
    else if (phase === 'previewPhase') {
      setPhase('signUpPhase')
    }
    else if (phase === 'favouritePhase') {
      setPhase('previewPhase')
    }
  }

  return (
    <>
      {(phase !== 'signUpPhase' && phase !== 'startPhase') &&
       <>
       <nav><div >
        <h2>PopCast & Chill</h2>
        <div className='topnav'>
             <h5><img className='profile' src='https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-512.png'/> {userLogIn}</h5>
            <button className="backButton" onClick={HandleBack} >
              {phase === 'previewPhase' ? 'LOGOUT' : 'BACK'}</button>
           </div> 
        <div className='bottomNav'>
        {phase === "previewPhase" && <input onChange={HandleSearch} placeholder="Search..." value={search} type='text' />}
        {phase !== "favouritePhase" && <button onClick={()=>setPhase('favouritePhase')}>Favourites</button>}  
        </div>
      </div>
       </nav>
      {phase === "previewPhase" &&
      <>
      <h1>Popular Shows</h1>
      <div className='Causarol'>
        <Carousel
         HandlePreviewClick={HandlePreviewClick}   
         Preview={phaseState.searchPreview}
        />
        </div>
        <h1>Only The Best To Watch</h1>
          <div className='SortNav'>
            <button onClick={sortByAscending}>A-Z</button>
            <button onClick={sortByDescending}>Z-A</button>
            <button onClick={sortByLatest}>Latest</button>
            <button onClick={sortByOldest}>Oldest</button>
            <button value={4}  onClick={SortByGender}>Comedy</button>
            <button value={3} onClick={SortByGender}>History</button>
            <button value={7} onClick={SortByGender}>Fiction</button>
          </div>
        </>
          }
      </>
  
      }
       <div className='DisplayStage'>
      
      { phase === 'signUpPhase' ? <SignIn /> :
        phase === 'startPhase' ? <div>{"LOADING..."}</div>  :
        phase === "favouritePhase" ? <><h1>FAVOURITES</h1>
                                     <Favorites
                                     HandleAudioPlay={HandleAudioPlay}/></>:
        phase === "favouritePhase" ? <><h1>Listen History</h1>
                                     <History
                                     Handle/></>:                          
        phase ===  'previewPhase' ?  <Preview   
                                     HandlePreviewClick={HandlePreviewClick}   
                                     Preview={FilteredElements} /> :
        phase === "seasonPhase"  ? <Season
                                    HandleSeasonClick={HandleSeasonClick}
                                    Preview={phaseState.Season} 
                                    ShowDes={showDescription}
                                    showImg = {showImage}/>:
        phase === "episodePhase" ?  <Episodes
                                    HandleAudioPlay={HandleAudioPlay}
                                    Preview={phaseState.Episode}
                                    favouriteSeasonTitle={favourite.favouriteSeasonTitle}
                                    favouriteShowTitle={favourite.favouriteShowTitle}
                                    email={userLogIn}
                                    /> : console.log('Episode Not fount')
      }
     </div>
      {(audioPlaying.audio  && phase !== 'signUpPhase') &&
        <div id='miniplayer' className="episodes">
          <h3>{audioPlaying.title}</h3>
          <audio src={audioPlaying.audio} controls autoPlay='false' />
          <button onClick={HandleMiniPlayClose}>Close</button>
        </div>
      }
    </>

  )
}

export default App;