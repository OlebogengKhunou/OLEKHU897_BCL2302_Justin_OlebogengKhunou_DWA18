import React from "react";

export default function Preview(props) {

    const genderToString = (gender) => {
        switch (gender) {
            case 1:
                return 'Personal Growth';
            case 2:
                return 'True Crime and Investigative Journalism';
            case 3:
                return 'History';
            case 4:
                return 'Comedy';
            case 5:
                return 'Entertainment';
            case 6:
                return 'Business';
            case 7:
                return 'Fiction';
            case 8:
                return 'News';
            case 9:
                return 'Kids and Family';
            default:
                return 'Unknown, ';
        }
    };


    const previewElements = props.Preview.map(item => {
        const UpdatedDate = new Date(item.updated)
        return (
            <button
                key={item.id}
                className="showItem"
                id={item.id}
                onClick={props.HandlePreviewClick}
                title={item.title}
                value={item.description}
                data-image={item.image}
            >
                <img src={item.image} />
                <p>{item.title}</p>
                <p>Seasons: {item.seasons}</p>
                <p>Gender: {item.genres.map(genderToString).join(', ')}</p>
                <p>Updated: {UpdatedDate.toLocaleDateString('en-GB')}</p>
            </button>
        )
    })

    return (
        <div className="previewDiv">
            {
                previewElements
            }
        </div>
    )
}
