import React, { useState } from "react";
import PetList from "../Pet/PetList";
import AddPetForm from "../Pet/AddPetForm";

function Dashboard() {
    const [pets, setPets] = useState([]);

    return (
        <div>
            <PetList pets={pets} setPets={setPets}/>
            <br/>
            <AddPetForm pets={pets} setPets={setPets}/>
        </div>
    )
}

export default Dashboard;