import React, { useState, useEffect } from "react";
import { supabase } from "./SignIn";

export default function Favorites(props) {
    const [favouriteData, setFavouriteData] = useState([]);
    const [state,setState] = useState('loading')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, error } = await supabase
                    .from('Favourites')
                    .select('*');
                if (error) {
                    console.error('Error fetching data:', error.message);
                } else {
                    setFavouriteData(data);
                    setState('favourites')
                }
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        };

        fetchData(); // Call the function to fetch data when the component mounts
    }, []);

    const handleDelete = async (title) => {
        const {data,error} = await supabase
        .from('Favourites')
        .delete()
        .eq('EpisodeTitle', title)
 
     if(error){
         console.log(error)
     }
     if (data){
         setFavouriteData(data)
     }
    }
    
    const favouriteElements = favouriteData.map(item => {
        const AddedDate = new Date(item.TimeStamp)
        return (
            <div
                key={item.id}
                className="episodes"
            >   
                <button  id={item.EpisodeFile} title={item.EpisodeTitle} onClick={props.HandleAudioPlay}>Play</button>
                <p>Episode: {item.EpisodeNumber}</p>
                <p>Title: {item.EpisodeTitle}</p>
                <p>Show: {item.Show}</p>
                <p>Seasons: {item.Season}</p>
                <p>Added: {AddedDate.toLocaleDateString('en-GB')}</p>
                <button onClick={()=>handleDelete(item.EpisodeTitle)}>DELETE</button>
            </div>
        )
    })

    return (
        <div>
            {
            state === 'loading' ? <div>{"LOADING..."}</div> : favouriteElements
            }
        </div>
    )
}