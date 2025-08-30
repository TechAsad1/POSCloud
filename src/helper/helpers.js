import axios from "axios";
import no_image from "../images/no_image.png";

export function dateFormat(_date) {
  try {
    if (!_date) return "";
    const formattedDate = new Date(_date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return formattedDate;
  } catch (error) {
    console.error("Error formatting date:", error);
    return ""; // fallback
  }
}

export function getImageFromUrl(imageName) {
  if (!imageName || imageName.trim() === "") {
    return no_image;
  }
  return `https://poscloud.itmechanix.com/images/${imageName}`;
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
  }).format(amount);
}
export async function uploadImage(getImgFile) {
  const url = 'https://posclouds.itmechanix.com/api/Product/uploadImg/file1';
  const formData = new FormData();
  formData.append('file', getImgFile);
  const response = await axios.post(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.message;
}
