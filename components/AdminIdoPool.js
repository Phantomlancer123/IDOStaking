import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React from 'react';

import styles from '../styles/AdminIdoPool.module.css';

export const AdminIdoPool = ({ pool, setSelectedPool, setIdos }) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handlePoolClick = e => {
    e.preventDefault();
    setSelectedPool(pool);
  };
  const handleEditClick = e => {
    e.preventDefault();
    router.push(`/admin/editido/${pool._id}`);
  };
  const handleDeleteClick = async e => {
    e.preventDefault();
    const access_token = Cookies.get('access_token');
    await axios({
      method: 'delete',
      url: `${process.env.NEXT_PUBLIC_FORWARDER_ORIGIN}/api/idos/${pool._id}`,
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    const response = await axios({
      method: 'get',
      url: `${process.env.NEXT_PUBLIC_FORWARDER_ORIGIN}/api/idos`
    });
    const idoData = {
      live: [],
      upcoming: [],
      completed: []
    };
    for (const ido of response.data) {
      if (ido.status === 'LIVE') {
        idoData.live.push(ido);
      } else if (ido.status === 'UPCOMING') {
        idoData.upcoming.push(ido);
      } else {
        idoData.completed.push(ido);
      }
    }
    setIdos(idoData);
    setOpen(false);
  };
  return (
    <div className={styles.container}>
      <div className={styles.idoPool}>
        <div className={styles.idoHeader}>
          <div className={styles.idoLogo}>
            <img src={pool.logo} alt={`${pool.name} logo`} />
          </div>
          <div className={styles.idoInfo}>
            <h5>{pool.name}</h5>
            <p>
              <a href={pool.website} target="_blank" rel="noreferrer">
                Website
              </a>
              {' | '}
              <a href={pool.twitter} target="_blank" rel="noreferrer">
                Twitter
              </a>
              {' | '}
              <a href={pool.telegram} target="_blank" rel="noreferrer">
                Telegram
              </a>
            </p>
          </div>
          <div className={styles.editButtons}>
            <button className={styles.editButton} onClick={handleEditClick}>
              <img src="/editido.svg" alt="Edit ido" />
            </button>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {'Are you sure you want to delete this IDO?'}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  {pool.name} IDO will be deleted permanently.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  NO
                </Button>
                <Button onClick={handleDeleteClick} color="primary">
                  YES
                </Button>
              </DialogActions>
            </Dialog>
            <button className={styles.editButton} onClick={handleClickOpen}>
              <DeleteForeverOutlinedIcon
                style={{
                  color: '#E53935'
                }}
              />
            </button>
          </div>
        </div>
        <div
          className={styles.idoBody}
          onClick={handlePoolClick}
          role="button"
          tabIndex={0}
          onKeyDown={handlePoolClick}
        >
          <p className={styles.idoStatus}>
            {' '}
            IDO Status: <span>{pool.status}</span> Pair:{' '}
            <span>{pool.pair}</span>
          </p>
          <p className={styles.idoDescription}>{pool.description}</p>
          <h5 className={styles.idoBodyHeader}>IDO Progress</h5>
          <div className={styles.progress}>
            <div
              className={styles.filler}
              style={{
                width: `${pool.progress}%`
              }}
            ></div>
          </div>
          <div className={styles.idoPercentage}>{pool.idoProgress}</div>
          <div className={styles.idoBottom}>
            <p className={styles.idoBottomSwap}>
              Price - 1 ETH:{' '}
              <span
                className={styles.idoPrice}
              >{`${pool.price} ${pool.symbol}`}</span>
            </p>
            <p className={styles.idoBottomCap}>
              Pool Cap -{' '}
              <span
                className={styles.idoSize}
              >{`${pool.poolCap} ${pool.symbol}`}</span>
            </p>
            <p className={styles.idoBottomAccess}>Access - Private</p>
            <p className={styles.idoBottomParticipants}>
              Participants - <span>{pool.participants}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
