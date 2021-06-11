const initialState = {
    user: {
        name: '',
        age: '18',
        hobbies: '',
        future: '',
        gallery: [],
        match: [],
        favouriteong: ''
    }
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_USER':
            return {
                ...state,
                user: action.payload
            }
        case 'ADD_TO_GALLERY':
            let addToGallery = [...state.user.gallery];
            addToGallery.push(action.payload)
            return {
                ...state,
                user: {
                    ...state.user,
                    gallery: addToGallery
                }

            }

        case 'REMOVE_FROM_GALLERY':
            const index = state.user.gallery.findIndex(obj => obj.imgName === action.payload.imgName);
            let newGallery = [...state.user.gallery];

            if (index >= 0) {
                newGallery.splice(index, 1);
            } else {
                console.log(`Cant remove image`)
            }
            return {
                ...state,
                user: {
                    ...state.user,
                    gallery: newGallery
                }

            }

        case 'ADD_TO_MATCH':
            let addToMatch = [...state.user.match];
            addToMatch.push(action.payload);
            console.log(action.payload);
            return {
                ...state,
                user: {
                    ...state.user,
                    match: addToMatch
                }
            }

        case 'ADD_FAVOURITE_SONG':
            return {
                ...state,
                user: {
                    ...state.user,
                    spotifyTrackId: action.payload.spotifyTrackId,
                    spotifyName: action.payload.spotifyName,
                    spotifyTrackName: action.payload.spotifyTrackName,
                    spotifyTrackImage: action.payload.spotifyTrackImage,
                    spotifyPreview: action.payload.spotifyPreview
                }
            }

        case 'USER_LOGOUT':
            return initialState
        default:
            return state
    }
}

export default userReducer