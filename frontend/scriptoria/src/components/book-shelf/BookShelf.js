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


const readingList = [
  {
    id: 1,
    img: 'https://1.bp.blogspot.com/-dxRQjpu6lWI/WtaooLQAsxI/AAAAAAAAQFA/LdV2nNaypxYK2TQZozeIdlQ_qhHpqB_XgCEwYBhgL/s1600/AC_Cv1000_var1960.jpg'
  },
  {
    id: 2,
    img: 'https://3.bp.blogspot.com/_eAs_CUZnVbk/S8E2zwGs3II/AAAAAAAAAZk/OFlq5PUNJtw/s1600/Fantastic+Four+197+Cover.jpg'
  },
  {
    id: 3,
    img: 'https://d1466nnw0ex81e.cloudfront.net/n_iv/600/3009011.jpg'
  },
  {
    id: 4,
    img: 'https://img.gocollect.com/eyJidWNrZXQiOiJnb2NvbGxlY3QuaW1hZ2VzLnB1YiIsImtleSI6IjFhNGVlMDdhLTg2MDItNGQ4My05YzkwLWEyYmI1ZGIxYTJjNi5qcGciLCJlZGl0cyI6W119'
  }
]


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
  const [works, setWorks] = useState([])
  const { t } = useTranslation()
  useEffect(() => {
    const fetchWrokes = async () => {
      const res = await getStories(props.userId)
      setWorks(res.stories)
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
        <ShelfHeader title={t("BookShelf.works")} btnTitle={t("BookShelf.see_all_works")} />
        <Carousel
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
        </Carousel>

      </div>
      <Shelf />


      <div className="carousel-container reading-list-books my-5" style={{}}>

        <ShelfHeader title={t("BookShelf.reading_list")} btnTitle={t("BookShelf.all_reading_list")} />

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
          {readingList.map((book, idx) => {
            return (
              <div className="row justify-content-center" key={idx}>
                <div className="col-lg-12">
                  {book?.coverPhoto ? <Book data={`data:image/png;base64,${Buffer.from(book?.coverPhoto).toString('base64')}`} /> : <></>}
                </div>
              </div>
            )
          })}
        </Carousel>

      </div>

      <Shelf />

    </div>
  );
}

export default BookShelf