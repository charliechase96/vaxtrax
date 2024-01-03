import React from "react";

function AddPetForm() {
    return (
        <form>
            <label>Pet Image URL</label>
            <input type="url" placeholder="Pet URL" />
            <label>Pet Name</label>
            <input type="text" placeholder="Pet name" required />
            <label>Type</label>
            <select required>
                <option>Cat</option>
                <option>Dog</option>
            </select>
            <label>Breed</label>
            <input type="text" placeholder="Pet breed" required/>
            <label>Pet Birthday</label>
            <input type="date" placeholder="MM/DD/YYYY" required />
            <button type="submit">Add Pet</button>
        </form>
    )
}

export default AddPetForm;