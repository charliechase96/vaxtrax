import React, { useState } from "react";

function AddPetForm({ pets, setPets }) {
    const [petImgUrl, setPetImgUrl] = useState("");
    const [petName, setPetName] = useState("");
    const [type, setType] = useState("Cat");
    const [breed, setBreed] = useState("");
    const [birthday, setBirthday] = useState("");

    const accessToken = localStorage.getItem('access_token');
    const userId = parseInt(localStorage.getItem('user_id'), 10);

    function handleSubmit(e) {
        e.preventDefault()

        if (!userId) {
            console.error('User ID is not available');
            return;
        }

        const petData = {
            img_url: petImgUrl,
            name: petName,
            type: type,
            breed: breed,
            birthday: birthday,
            user_id: userId
        };

        fetch(`https://api.vaxtrax.pet/${userId}/add_pet`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(petData),
        })
        .then(response => {
            if (response.ok || response.status === 201) {
                return response.json();
            }
        })
        .then(data => {
            console.log("Pet added:", data);
            setPets(currentPets => [...currentPets, data]);
            setPetImgUrl("");
            setPetName("");
            setType("Cat");
            setBreed("");
            setBirthday("");
        })
        .catch(error => {
            console.error("Error adding pet:", error);
        });
    }
    

    return (
        <div className="add-pet-form">
            <h2>Add a Pet</h2>
            <form onSubmit={handleSubmit}>
                <label>Pet Image URL</label>
                <input 
                    value={petImgUrl}
                    onChange={(e) => setPetImgUrl(e.target.value)}
                    type="url" 
                    placeholder="Pet URL" 
                />
                <label>Pet Name</label>
                <input 
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    type="text" 
                    placeholder="Pet name" 
                    required 
                />
                <label>Type</label>
                <select 
                    defaultValue={type} 
                    onChange={(e) => setType(e.target.value)}
                    required
                >
                    <option
                        disabled
                    >
                        Type
                    </option>
                    <option value="Cat">Cat</option>
                    <option value="Dog">Dog</option>
                </select>
                <label>Breed</label>
                <input 
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                    type="text" 
                    placeholder="Pet breed" 
                    required
                />
                <label>Pet Birthday</label>
                <input 
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    type="date" 
                    placeholder="YYYY/MM/DD" 
                    required 
                />
                <button type="submit">Add Pet</button>
            </form>
        </div>
    )
}

export default AddPetForm;