import multer from 'multer';

//importa para o disco
 const diskStorage = multer.diskStorage({
    destination: './public/images',
     filename: function (req: any, file: any, cb: any) {
         cb(null, file.originalname)
     }
 });

 //Validação mimetype no servidor
 const fileFilter = (req: any,file: any,cb: any) => {
  const allowedMimeTypes =['image/jpg', 'image/jpeg', 'image/png'];
  allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(new Error("Image uploaded is not of type jpg/jpeg or png"),false);
 }
 //upload
const upload = multer({storage: diskStorage, fileFilter : fileFilter}).single('file');

export default upload;