import React from 'react'
import Fuse from 'fuse.js'
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
    DefaultPreview: [],
    Season: '',
    Episode: ''
  });

  const [favourite, setFavourite] = React.useState({
    favouriteShowTitle: '',
    favouriteSeasonTitle: '',
  });


//If the signIn is correct then the Phase will change to loading page for preview
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

  
//Used Fuse for Searching specific via user input. 
  const fuse = new Fuse(phaseState.DefaultPreview, {
    keys: ['title'],includeScore: true
  })
  
  function HandleSearch(event) {
    setSearch(event.target.value);
  }
  const results = fuse.search(search)
  const FilteredElements = search ? results.map(result => result.item) : phaseState.Preview
  
//Fetching Preview data and set PreviewPhase to fetched data then set Phase to Preview.
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
            DefaultPreview: data
          }))
        }
      })
  }, [phase])

//fetching Seasons data
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

// Getting Episodes Object from the Season Object clicked
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
      title: '',
      audio: ''
    }
  );

  //Collects episode details via attributes
  async function HandleAudioPlay(event)  {
    const audioToPlay = event.target.id
    const audioTitle = event.target.title
    const EpisodeDescription =  event.target.getAttribute('data-description')
    const EpisodeNumber =  event.target.getAttribute('data-episodenumber')
    
    setaudioPlaying(prev => ({
      ...prev,
      audio: audioToPlay 
    }))
    setaudioPlaying(prev => ({
      ...prev,
      title: audioTitle
  }))

    const Season = favourite.favouriteSeasonTitle
    const Show = favourite.favouriteShowTitle
    const Email = userLogIn
    const EpisodeTitle = audioTitle
    const EpisodeFile = audioToPlay

    try {
        const { data, error } = await supabase
            .from('History')
            .insert([
                { Season, Show, EpisodeTitle, EpisodeDescription, EpisodeNumber, EpisodeFile, Email },
            ]);

        if (error) {
            console.error('Error inserting data:', error.message);
        } else {
            // console.log('Data inserted successfully:', data);
        }
    } catch (error) {
        console.error('Error inserting data:', error.message);
    };
}``

  function HandleMiniPlayClose() {
      const shouldClose = confirm("Are you sure you want to close miniplayer?");
      if (shouldClose) {
        setaudioPlaying(prevA => ({
          ...prevA,
          audio: '', title: ''
        }))
      }
    }

// Sorting Section
  function SortByGender(event){
    const selectedGenre = parseInt(event.target.value)
    setPhaseState(prevPhase => ({
      ...prevPhase,
      Preview: phaseState.DefaultPreview.filter((item)=> item.genres.includes(selectedGenre)) 
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

//Back Button
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
    else if (phase === 'historyPhase') {
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
        <div className='HistoryAndFavButtons'>
        {phase !== "favouritePhase" && <button onClick={()=>setPhase('favouritePhase')}>Favourites</button>}
        {phase !== "historyPhase" && <button onClick={()=>setPhase('historyPhase')}>History</button>}  
        </div>
        </div>
      </div>
       </nav>
      {phase === "previewPhase" &&
      <>
      <h1>Popular Shows</h1>
      <div className='Causarol'>
        <Carousel
         HandlePreviewClick={HandlePreviewClick}   
         Preview={phaseState.DefaultPreview}
        />
        </div>
        <h1>Only The Best To Watch</h1>
          <div className='SortNav'>
            <button onClick={sortByAscending}>A-Z</button>
            <button onClick={sortByDescending}>Z-A</button>
            <button onClick={sortByLatest}>Latest</button>
            <button onClick={sortByOldest}>Oldest</button>
            <button value={7} onClick={SortByGender}>Fiction</button>
            <button value={3} onClick={SortByGender}>History</button>
            <button value={5}  onClick={SortByGender}>Entertainment</button>
          </div>
        </>
          }
      </>
  
      }
       <div className='DisplayStage'>
      
      { phase === 'signUpPhase' ? <SignIn /> :
        phase === 'startPhase' ? <div>{"LOADING..."}</div>  :
        phase === "favouritePhase" ? <Favorites
                                     HandleAudioPlay={HandleAudioPlay}
                                     email={userLogIn}/>:
        phase === "historyPhase" ? <History
                                     email={userLogIn}/>:                          
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
     
      {(audioPlaying.audio  && phase !== 'signUpPhase' && phase !== 'startPhase') &&
        <div id='miniplayer' className="episodes">
          <h3>{audioPlaying.title}</h3>
          <audio src={audioPlaying.audio} controls autoPlay/>
          <button onClick={HandleMiniPlayClose}>Close</button>
        </div>
      }
    </>

  )
}

export default App;