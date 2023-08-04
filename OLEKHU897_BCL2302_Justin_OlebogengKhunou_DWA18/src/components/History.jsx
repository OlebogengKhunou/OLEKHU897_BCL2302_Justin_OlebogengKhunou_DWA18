import React, { useState, useEffect } from "react";
import { supabase } from "./SignIn";

export default function History() {
    const [historyData, setHistoryData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, error } = await supabase
                    .from('History')
                    .select('*');
                if (error) {
                    console.error('Error fetching data:', error.message);
                } else {
                    setHistoryData(data);
                }
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        };

        fetchData(); // Call the function to fetch data when the component mounts
    }, []);

    const historyElements = historyData.map(item => {
        return (
            <button
                key={item.id}
                className="episodes"
            >
                <p>Episode: {item.EpisodeNumber}</p>
                <p>Title: {item.EpisodeTitle}</p>
                <p>Show: {item.Show}</p>
                <p>Seasons: {item.Season}</p>
                <p>Updated: {item.TimeStamp}</p>
            </button>
        )
    })

    return (
        <div>
            {
                historyElements
            }
        </div>
    )
}