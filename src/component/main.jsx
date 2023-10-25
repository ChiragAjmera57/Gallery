import {  Input, Modal, Switch } from "@mui/material";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { LazyLoadImage } from "react-lazy-load-image-component";
import DownloadIcon from "@mui/icons-material/Download";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import hero from '../hero.png'
import Skeleton from '@mui/material/Skeleton';



export const Main = () => {
  const [photos, setPhotos] = useState([]);
  const [page, setpage] = useState(1);
  const [total_pages, setTotal] = useState(null);
  const apiKey = "Jw3EwQVF5LlzrHFIVI2te13D8fjRnW0CHj9DBslK7gU";
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [single, setsingle] = useState(null);
  const[query,setquery] = useState("")
  const [checked, setChecked] = useState(false);


  const downloadImage = () => {
    const imageSrc = single?.links?.download;
    const link = document.createElement("a");
    link.href = imageSrc;
    link.download = "downloaded-image.jpg";
    link.click();
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleswitch = ()=>{
    setChecked((prev)=>!prev)
  }
  const fetchNextPageData = () => {

    
    const apiUrl = `https://api.unsplash.com/photos/?client_id=${apiKey}&page=${page}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setPhotos([...photos, ...data]);
  
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    setpage((pre) => pre + 1);
  };
  let url = `https://api.unsplash.com/photos/?client_id=${apiKey}&page=1`

  const fetchInitial = () => {
    setLoading(true)
    const result = query?.length > 0 ? `https://api.unsplash.com/search/collections?page=1&query=${query}&client_id=Jw3EwQVF5LlzrHFIVI2te13D8fjRnW0CHj9DBslK7gU` : url;

    const apiUrl = result;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const xTotalHeader = response.headers.get("X-Total");
        setTotal(xTotalHeader);
        return response.json();
      })
      .then((data) => {
        if(query.length>0){
          setPhotos(data.results)
        }
        else{
          setPhotos(data);
        }
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  useEffect(() => {
    fetchInitial();
    if(checked)
    {
      document.body.style.backgroundColor = 'black'
    } 
    else{
      document.body.style.backgroundColor = 'white'
    }
  }, [query,checked]);

  return (
    <div className="main">
      <nav>
        <div className="logo">
          <p>Image Gallery</p>
        </div>
        <div className="search-bar">
          <Input placeholder="Search" size="small" value={query} onChange={(e)=>setquery(e.target.value)} />
        </div>
        <p className="nav-p none">Explore</p>
        <p className="nav-p none">Collection</p>
        <p className="nav-p none">Community</p>
        <div className="dark-mode">
          <p className="nav-p">Dark Mode</p>
          <Switch size="small" checked={checked}
        onChange={handleswitch}
        inputProps={{ 'aria-label': 'controlled' }}
        />
        </div>
      </nav>
      <div className="hero">
        <img src={hero} alt="" srcSet="" />
      </div>
      {
        loading?<Skeleton height={400} width={'90%'} style={{margin:"auto"}} />:<div id="modal">
        {
          <InfiniteScroll
            className="gallary"
            dataLength={photos?.length || []}
            next={fetchNextPageData}
            hasMore={page < total_pages}
          >
            {photos?.map((ele, index) => {
              const handleOpen = (element) => () => {
                console.log("Clicked element details:", element);
                setsingle(element);
                setOpen(true);
              };

              return (
                <div key={index} onClick={handleOpen(ele)} className="pics">
                  <LazyLoadImage
                    effect="black-and-white"
                    src={ele?.urls?.regular||ele?.cover_photo?.urls?.regular}
                    style={{ width: "100%" }}
                    alt=""
                  />
                </div>
              );
            })}
          </InfiniteScroll>
        }
      </div>
      }
      
      <Modal
        open={open}
        className="modal"
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div className="image-container">
          <img
            src={single?.urls?.small||single?.cover_photo?.urls?.small}
            alt=""
            className="image"
            id="myImage"
          />
          <div className="pic-details">
            <div className="left">
              <img
                id="user-logo"
                src={single?.user?.profile_image?.small}
                alt="Photographer Logo"
                className="photographer-logo"
              />
              <p className="photographer">{single?.user?.name}</p>
              {single?.user?.social?.instagram_username !== null ? (
                <a
                  href={`https://www.instagram.com/${single?.user?.social?.instagram_username}`}
                  target="_blank" rel="noreferrer"
                >
                  <InstagramIcon />
                </a>
              ) : (
                ""
              )}
              {single?.user?.social?.twitter_username !== null ? (
                <a
                  href={`https://twitter.com/${single?.user?.social?.twitter_username}`}
                  target="_blank" rel="noreferrer"
                >
                  <TwitterIcon />
                </a>
              ) : (
                ""
              )}
            </div>
            <div className="right">
              <p className="downloads">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="21"
                  viewBox="0 0 21 21"
                  fill="none"
                >
                  <path
                    d="M6.54492 16.0563L9.25742 18.1563C9.60742 18.5063 10.3949 18.6813 10.9199 18.6813H14.2449C15.2949 18.6813 16.4324 17.8938 16.6949 16.8438L18.7949 10.4563C19.2324 9.23126 18.4449 8.18126 17.1324 8.18126H13.6324C13.1074 8.18126 12.6699 7.74376 12.7574 7.13126L13.1949 4.33126C13.3699 3.54376 12.8449 2.66876 12.0574 2.40626C11.3574 2.14376 10.4824 2.49376 10.1324 3.01876L6.54492 8.35626"
                    stroke="#858484"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                  />
                  <path
                    d="M2.08252 16.0562V7.48125C2.08252 6.25625 2.60752 5.81875 3.83252 5.81875H4.70752C5.93252 5.81875 6.45752 6.25625 6.45752 7.48125V16.0562C6.45752 17.2812 5.93252 17.7187 4.70752 17.7187H3.83252C2.60752 17.7187 2.08252 17.2812 2.08252 16.0562Z"
                    stroke="#858484"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {`${single?.likes||single?.cover_photo?.likes}`||0}
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <a
                  onClick={downloadImage}
                  href={single?.links?.download}
                  target="_blank"
                  style={{
                    borderRadius: "4px",
                    background: "#3CB46E",
                    padding: "5px",
                    fontSize:'15px',
                    fontWeight:'500',
                    textDecoration:'none'
                  }}
                  download
                  rel="noreferrer"
                >
                  Download image
                  <DownloadIcon fontSize="small" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
