import React from "react";
import PetList from "../Pet/PetList";
import AddPetForm from "../Pet/AddPetForm";

function Dashboard() {
    return (
        <div>
            <PetList />
            <br/>
            <AddPetForm />
        </div>
    )
}

export default Dashboard;