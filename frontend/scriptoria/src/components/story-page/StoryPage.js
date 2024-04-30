
import React from 'react'
import StoryHeader from "../story-header/StoryHeader"
import StoryCard from "../story-overview/StoryOverview"
import Navbar from '../navbar/Navbar'
import Footer from '../footer/Footer'
const StoryPage = () => {
    return (
        <div>
            <Navbar />
            <StoryHeader />
            <StoryCard />
        </div>
    )
}

export default StoryPage
