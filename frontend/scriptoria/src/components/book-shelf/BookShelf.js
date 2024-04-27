import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import './BookShelf.css'
import Book from "./book/Book.js";
import Shelf from "./shelf/Shelf.js";
import ShelfHeader from "./shelf-header/ShelfHeader.js";
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from "react";
import { getStories } from "../../api/writers.js";
import { Buffer } from "buffer";
import useAuth from "../../hooks/useAuth.js";
import {getReadingLists,getValidStoriesFrom } from "../../api/readingListsApi.js";
import logo from './../../img/scriptoria-logo-black.png'


// Responsive property for the <Carousel> tag from react-multi-carousel package
const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 1, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 2,
    slidesToSlide: 1, // optional, default to 1.
  }
};

const BookShelf = (props) => {
  const {auth} = useAuth()
  const [works, setWorks] = useState([])
  const [covers, setCovers] = useState([])
  const { t } = useTranslation()
  useEffect(() => {
    const fetchWrokes = async () => {
      const res = await getStories(props.userId)
      setWorks(res.stories)

      const response = await getReadingLists(props.username, auth?.userName===props.username)
      const coverPormises = response.map(async(list)=>{
        const data = await getValidStoriesFrom(props.username, list._id, auth?.userInfo?._id)
        const stories = data?.stories?.filter((story)=> story!==undefined)
        let cover = logo
        if(stories.length){
          cover = `data:image/png;base64,${Buffer.from(stories[0]?.coverPhoto).toString('base64')}`
        }
        return cover
      })

      const allCovers = await Promise.all(coverPormises)
      setCovers(allCovers)
    }
    fetchWrokes()
  }, [])
  const CustomLeftArrow = ({ onClick }) => (
    <button className="custom-arrow custom-left-arrow" onClick={onClick}>
      &lt; {/* left arrow symbol */}
    </button>
  );

  const CustomRightArrow = ({ onClick }) => (
    <button className="custom-arrow custom-right-arrow" onClick={onClick}>
      &gt; {/* right arrow symbol */}
    </button>
  );

  return (
    <div className="mx-5 my-5 book-shelf ">
      <div className="carousel-container works-books my-5">
        <ShelfHeader title={t("BookShelf.works")} btnTitle={t("BookShelf.see_all_works")} state={works?.length} />
        {works?.length ? <Carousel
          responsive={responsive}
          containerClass="custom-carousel hide-arrows"
          itemClass="custom-slide"
          infinite={true}
          swipeable={true}
          draggable={false}
          showDots={false}
          ssr={true}
          autoPlay={false}
          autoPlaySpeed={1000}
          keyBoardControl={true}
          customTransition="transform 1000ms ease-in-out"
          transitionDuration={800}
          removeArrowOnDeviceType={["tablet", "mobile"]}
          deviceType={props.deviceType}
          dotListClass="custom-dot-list-style"
          focusOnSelect={true}
          partialVisbile={false}
          customRightArrow={<CustomRightArrow />}
          customLeftArrow={<CustomLeftArrow />}
        >
          {works?.map((book, idx) => {
            return (
              <div className="row justify-content-center" key={idx}>
                <div className="col-lg-12">
                  <Book data={`data:image/png;base64,${Buffer.from(book.coverPhoto).toString('base64')}`} />
                </div>
              </div>
            )
          })}
        </Carousel> :
          <></>}

      </div>
      <Shelf />

        {
          covers?.length? 
          <div className="carousel-container reading-list-books my-5" style={{}}>
          <ShelfHeader title={t("BookShelf.reading_list")} btnTitle={t("BookShelf.all_reading_list")} state={covers?.length} link={`/profile/${props.username}/lists`} />
            <Carousel
              responsive={responsive}
              containerClass="custom-carousel"
              itemClass="custom-slide"
              infinite={true}
              swipeable={false}
              draggable={false}
              showDots={false}
              ssr={true}
              autoPlay={false}
              autoPlaySpeed={1000}
              keyBoardControl={true}
              customTransition="transform 1000ms ease-in-out"
              transitionDuration={800}
              removeArrowOnDeviceType={["tablet", "mobile"]}
              deviceType={props.deviceType}
              dotListClass="custom-dot-list-style"
              focusOnSelect={true}
              partialVisbile={false}
              customRightArrow={<CustomRightArrow />}
              customLeftArrow={<CustomLeftArrow />}
            >
              {covers.map((cover, idx) => {
                console.log(cover,10)
                return (
                  <div className="row justify-content-center" key={idx}>
                    <div className="col-lg-12"> 
                      { cover? <Book data={cover} /> : <></>}
                    </div>
                  </div>
                )
              })}
            </Carousel>
        </div>
          : 
          <></>
        }


      <Shelf />

    </div>
  );
}

export default BookShelf