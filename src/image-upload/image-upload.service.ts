import { Injectable } from '@nestjs/common';
import * as FormData from 'form-data';
import axios from 'axios';

@Injectable()
export class ImageUploadService {
  async uploadImage(image) {
    const imgbbApiKey = '0d3edfce6d260f40aab610d26c50a74b';
    const imgbbUrl = `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`;

    const formData = new FormData();
    formData.append('image', image.buffer.toString('base64'));

    const imgbbResponse = await axios.post(imgbbUrl, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    const imageUrl = imgbbResponse.data.data.url;
    return imageUrl;
  }
}
