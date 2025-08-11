"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const hashedPassword_1 = __importDefault(require("../../utils/hashedPassword"));
const userSchema = new mongoose_1.Schema({
    fullName: {
        type: String,
        required: [true, 'fullName is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true,
        default: ""
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        select: 0
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    passwordChangedAt: {
        type: Date,
    },
    role: {
        type: String,
        enum: ["user", "admin", "super_admin"],
        default: "user"
    },
    status: {
        type: String,
        enum: ['blocked', 'unblocked'],
        default: 'unblocked'
    },
    otp: {
        type: String,
        required: [true, "otp is required"],
        trim: true,
        maxlength: 6,
        minlength: 6
    },
    otpExpires: {
        type: Date,
        default: () => new Date(+new Date() + 600000), // 10 minutes // OTP Code Will be expired within 10 minutes
    },
}, {
    timestamps: true,
    versionKey: false
});
//Hash Password before saving
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this; //this means user
        // Only hash the password if it has been modified (or is new)
        if (!user.isModified("password"))
            return next();
        user.password = yield (0, hashedPassword_1.default)(user.password);
        next();
    });
});
const UserModel = (0, mongoose_1.model)('User', userSchema);
exports.default = UserModel;
