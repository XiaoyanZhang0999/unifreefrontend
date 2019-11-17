import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { Redirect } from 'react-router-dom';
import cookie from 'react-cookies';
import { Dialog } from '@material-ui/core';
import config from '../../../config';
import { serviceRequest } from '../../../services/serviceRequest';
import { PostForm } from '../PostForm/PostForm';

const path = '/api/v1/user/createpost';
const domain = config.apiDomain;

const preparePayload = (method, data) => {
  const token = cookie.load('jwtToken');
  const requestHeader = { Authorization: token };
  const url = `https://${domain}${path}`;
  return {
    method,
    url,
    headers: requestHeader,
    data,
  };
};

export const CreatePostForm = () => {
  const [open, setOpen] = useState(false);
  const [formData, setForm] = useState({ label: 'general', title: null, content: null });
  const [isValidPost, setIsValidPost] = useState(false);
  const [Url, setUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (event) => {
    const updateForm = { ...formData };
    updateForm[event.target.name] = event.target.value;
    setForm(updateForm);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setErrorMsg('');
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.label || !formData.title || !formData.content) return;
    try {
      const requestPayload = preparePayload('post', formData);
      const response = await serviceRequest(requestPayload);
      if (response.status && response.status === 'success') {
        setUrl(`/viewpost/${response.data.postID}`);
        handleClose();
        setIsValidPost(true);
      } else if (response.status && response.status === 'error') {
        setErrorMsg('Authentication Error');
      } else {
        throw new Error('Internal Service Error');
      }
    } catch (err) {
      setErrorMsg('Internal Service Error');
    }
  };

  return (
    <div>
      {isValidPost && <Redirect to={Url} />}
      <Button data-testid="create-post-button" variant="outlined" color="inherit" onClick={handleClickOpen}>
        Create Post
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <PostForm
          handleChange={handleChange}
          handleCreate={handleCreate}
          handleClose={handleClose}
          errorMsg={errorMsg}
        />
      </Dialog>
    </div>
  );
};
