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
const config_1 = __importDefault(require("../config"));
const verifyToken_1 = __importDefault(require("../utils/verifyToken"));
const user_model_1 = __importDefault(require("../modules/User/user.model"));
const isJWTIssuedBeforePassChanged_1 = require("../utils/isJWTIssuedBeforePassChanged");
const AuthMiddleware = (...roles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: "You are not authorized",
                    error: {
                        message: "jwt token must be provided",
                    },
                });
            }
            //token-verify
            const decoded = (0, verifyToken_1.default)(token, config_1.default.jwt_access_secret);
            //check if role is matching
            if (roles.length > 0 && !roles.includes(decoded.role)) {
                return res.status(401).json({
                    success: false,
                    message: "You are not authorized",
                    error: {
                        message: `Please, provide ${roles.map(role => `'${role}'`).join(" or ")} token`,
                    },
                });
            }
            const user = yield user_model_1.default.findById(decoded.id);
            //check if user is not exist
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "You are not authorized",
                    error: {
                        message: "This user is not existed",
                    },
                });
            }
            //check if the user is blocked
            const blockStatus = user.status;
            if (blockStatus === "blocked") {
                return res.status(401).json({
                    success: false,
                    message: "You are not authorized",
                    error: {
                        message: "This user is blocked",
                    },
                });
            }
            //check if the user email is not verified
            if (!(user === null || user === void 0 ? void 0 : user.isVerified)) {
                return res.status(401).json({
                    success: false,
                    message: "You are not authorized",
                    error: {
                        message: "This Account is not verified",
                    },
                });
            }
            //check if passwordChangedAt is greater than token iat
            if ((user === null || user === void 0 ? void 0 : user.passwordChangedAt) &&
                (0, isJWTIssuedBeforePassChanged_1.isJWTIssuedBeforePassChanged)(user === null || user === void 0 ? void 0 : user.passwordChangedAt, decoded.iat)) {
                return res.status(401).json({
                    success: false,
                    message: "You are not authorized",
                    error: {
                        message: "Your password has been changed, please login again",
                    },
                });
            }
            req.user = decoded;
            //set id & email to headers
            req.headers.email = decoded.email;
            req.headers.id = decoded.id;
            req.headers.role = decoded.role;
            next();
        }
        catch (err) {
            res.status(401).json({
                success: false,
                message: "You are not authorized",
                error: {
                    message: err.message
                }
            });
        }
    });
};
exports.default = AuthMiddleware;
