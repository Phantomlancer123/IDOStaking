import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
import EditIcon from '@material-ui/icons/Edit';
import axios from 'axios';
import Cookies from 'js-cookie';
import * as jwt from 'jsonwebtoken';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Carousel from 'react-material-ui-carousel';

import { AdminDashboardHeader } from '../../components/AdminDashboardHeader';
import { BannerItem } from '../../components/BannerItem';
import { ConnectMetamask } from '../../components/ConnectMetamask';
import { Footer } from '../../components/Footer';
import styles from '../../styles/AdminBanners.module.css';

const fileUpload = file => {
  const token = Cookies.get('access_token');
  const url = '/api/banners';
  const formData = new FormData();
  formData.append('banner', file);
  const config = {
    headers: {
      'content-type': 'multipart/form-data',
      authorization: `Bearer ${token}`
    }
  };
  return axios.post(url, formData, config);
};

export default function AdminBanners() {
  const [ethAddress, setEthAddress] = useState('');
  const [connectionText, setConnectionText] = useState('');
  const [open, setOpen] = useState(false);
  const [banners, setBanners] = useState([]);
  const [file, setFile] = useState();
  const [uploadResult, setUploadResult] = useState({
    isSuccessfull: false,
    isNotSuccessfull: false,
    message: ''
  });

  const getBanners = async () => {
    const url = '/api/banners';
    const response = await axios.get(url);
    setBanners(response.data);
  };

  useEffect(() => {
    getBanners();
  }, []);

  const handleClickOpen = e => {
    setOpen(true);
  };

  const handleCloseClick = () => {
    setOpen(false);
  };

  const deleteBanner = async id => {
    const token = Cookies.get('access_token');
    const url = '/api/banners';
    const config = {
      headers: {
        authorization: `Bearer ${token}`
      },
      params: {
        id
      }
    };
    return axios.delete(url, config);
  };

  const handleDeleteClick = async id => {
    await deleteBanner(id);
    // get latest banners and update banners list
    getBanners();
    setOpen(false);
  };

  const handleFileSubmit = e => {
    e.preventDefault(); // Stop form submit
    fileUpload(file)
      .then(() => {
        // get latest banners and update banners list
        getBanners();
        setUploadResult({
          isSuccessfull: true,
          isNotSuccessfull: false,
          message: 'Banner uploaded successfully'
        });
        setTimeout(() => {
          setUploadResult({
            isSuccessfull: false,
            isNotSuccessfull: false,
            message: ''
          });
        }, 3000);
      })
      .catch(error => {
        setUploadResult({
          isSuccessfull: false,
          isNotSuccessfull: true,
          message: error.response.data.message
        });
        setTimeout(() => {
          setUploadResult({
            isSuccessfull: false,
            isNotSuccessfull: false,
            message: ''
          });
        }, 3000);
      });
  };

  const onChange = e => {
    setFile(e.target.files[0]);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Crypto Excellence</title>
        <meta name="description" content="Crypto Excellence" />
        <link rel="icon" href="/cefavicon.png" />
      </Head>
      <video
        playsInline
        autoPlay
        muted
        loop
        id="bgvid"
        className={styles.video}
      >
        <source src="/bgvideo.mp4" type="video/mp4" />
      </video>
      <AdminDashboardHeader
        ethAddress={ethAddress}
        setEthAddress={setEthAddress}
        setConnectionText={setConnectionText}
      />
      <main className={styles.main}>
        {ethAddress === '' ? (
          <section className={styles.wrapper}>
            <ConnectMetamask
              ethAddress={ethAddress}
              setEthAddress={setEthAddress}
              connectionText={connectionText}
              setConnectionText={setConnectionText}
            />
          </section>
        ) : (
          <section className={styles.container}>
            <div>
              <form onSubmit={handleFileSubmit}>
                <h1>Upload banner</h1>
                <input type="file" onChange={onChange} />
                <button type="submit">Upload</button>
                {uploadResult.isSuccessfull && (
                  <p className={styles.successText}>{uploadResult.message}</p>
                )}
                {uploadResult.isNotSuccessfull && (
                  <p className={styles.errorText}>{uploadResult.message}</p>
                )}
              </form>
              <div>
                <h1>Live banners</h1>
              </div>
              <div className={styles.gallery}>
                {banners.map(banner => (
                  <div key={banner._id}>
                    <img src={banner.path} alt="" />
                    <div className={styles.buttons}>
                      {/* <button className={styles.editButton}> */}
                      {/*   <EditIcon */}
                      {/*     style={{ */}
                      {/*       color: '#fff' */}
                      {/*     }} */}
                      {/*   /> */}
                      {/* </button> */}
                      <button
                        className={styles.editButton}
                        onClick={handleClickOpen}
                      >
                        <DeleteForeverOutlinedIcon
                          style={{
                            color: '#E53935'
                          }}
                        />
                      </button>
                      <Dialog
                        open={open}
                        onClose={handleCloseClick}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                      >
                        <DialogTitle id="alert-dialog-title">
                          {'Are you sure you want to delete this banner?'}
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText id="alert-dialog-description">
                            This banner will be deleted permanently.
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleCloseClick} color="primary">
                            NO
                          </Button>
                          <Button
                            onClick={() => handleDeleteClick(banner._id)}
                            color="primary"
                          >
                            YES
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </div>
              <h1>Banner carousel demo</h1>
              <div className={styles.banner}>
                <Carousel indicators={true}>
                  {banners.map(banner => {
                    return <BannerItem item={banner} key={banner._id} />;
                  })}
                </Carousel>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
