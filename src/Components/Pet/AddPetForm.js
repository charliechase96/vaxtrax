import React, { useEffect, useState } from "react";

function AddPetForm() {
    const [petImgUrl, setPetImgUrl] = useState("");
    const [petName, setPetName] = useState("");
    const [type, setType] = useState("Type");
    const [breed, setBreed] = useState("");
    const [birthday, setBirthday] = useState("");
    const [userId, setUserId] = useState(null);

    const authToken = localStorage.getItem('authToken');

    useEffect(() => {
        const storedUserId = localStorage.getItem('user_id');
        if (storedUserId) {
            setUserId(storedUserId);
        }
    }, []);

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

        fetch('http://localhost:5000/api/add_pet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
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
            setPetImgUrl("");
            setPetName("");
            setType("Type");
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