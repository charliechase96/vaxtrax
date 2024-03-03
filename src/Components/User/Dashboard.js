import React, { useState } from "react";
import PetList from "../Pet/PetList";
import AddPetForm from "../Pet/AddPetForm";

function Dashboard({userId}) {
    const [pets, setPets] = useState([]);

    return (
        <div>
            <PetList userId={userId} pets={pets} setPets={setPets}/>
            <br/>
            <AddPetForm setPets={setPets}/>
        </div>
    )
}

export default Dashboard;