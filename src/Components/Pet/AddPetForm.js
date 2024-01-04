import React, { useState } from "react";

function AddPetForm() {
    const [petImgUrl, setPetImgUrl] = useState("");
    const [petName, setPetName] = useState("");
    const [type, setType] = useState("Type");
    const [breed, setBreed] = useState("");
    const [birthday, setBirthday] = useState("");

    function handleSubmit(e) {
        e.preventDefault()

        const petData = {
            img_url: petImgUrl,
            name: petName,
            type: type,
            breed: breed,
            birthday: birthday
        };

        fetch('http://localhost:5000/api/add_pet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
            body: JSON.stringify(petData),
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not okay.');
        })
        .then(data => {
            console.log("Pet added:", data);
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
                    placeholder="MM/DD/YYYY" 
                    required 
                />
                <button type="submit">Add Pet</button>
            </form>
        </div>
    )
}

export default AddPetForm;