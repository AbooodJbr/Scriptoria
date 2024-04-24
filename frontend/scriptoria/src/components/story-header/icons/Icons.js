import { useState, useEffect, useId } from "react";
import Comment from "./Comment";
import Heart from "./Heart";
import Plus from "./Plus";
import Rates from "./Rates";
import Share from "./Share";
import { findAccount } from "../../../api/accountApi";
import useAuth from "../../../hooks/useAuth";

const Icons = ({ data, id, counts, setData }) => {

    return (
        <div className='icons my-2 mx-5 d-flex gap-1 justify-content-center align-items-center' style={{ display: 'flex', alignItems: 'center', borderRadius: '10px' }}>
            <Heart num={data.likes} storyId={id} setData={setData} />
            <Comment id={id} num={counts.comments} />
            <Rates id={id} num={counts.rates} avg={counts.avg} />
            <Plus id={id} />
            <Share />
        </div>
    );
}

export default Icons;