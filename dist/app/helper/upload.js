"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const storageMain = multer_1.default.diskStorage({
    // destination: function (req, file, cb) {
    //   cb(null, "uploads/");
    // },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        let extension = file.originalname.split(".")[1];
        cb(null, file.fieldname + "-" + uniqueSuffix + "." + extension);
    },
});
//const storage = multer.memoryStorage()
//const upload = multer({ storage: storage });
const upload = (0, multer_1.default)({ storage: storageMain });
exports.default = upload;
