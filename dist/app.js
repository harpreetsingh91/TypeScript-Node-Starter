"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression")); // compresses requests
const express_session_1 = __importDefault(require("express-session"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const lusca_1 = __importDefault(require("lusca"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_flash_1 = __importDefault(require("express-flash"));
const path_1 = __importDefault(require("path"));
const passport_1 = __importDefault(require("passport"));
const express_validator_1 = __importDefault(require("express-validator"));
// Load environment variables from .env file, where API keys and passwords are configured
dotenv_1.default.config({ path: ".env.example" });
// Controllers (route handlers)
const daanApiController = __importStar(require("./controllers/daan"));
// Create Express server
const app = express_1.default();
// Express configuration
app.set("port", process.env.PORT || 3000);
app.set("views", path_1.default.join(__dirname, "../views"));
app.set("view engine", "pug");
app.use(compression_1.default());
app.use(morgan_1.default("dev"));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_validator_1.default());
app.use(express_session_1.default({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(express_flash_1.default());
app.use(lusca_1.default.xframe("SAMEORIGIN"));
app.use(lusca_1.default.xssProtection(true));
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});
app.use((req, res, next) => {
    // After successful login, redirect back to the intended page
    if (!req.user &&
        req.path !== "/login" &&
        req.path !== "/signup" &&
        !req.path.match(/^\/auth/) &&
        !req.path.match(/\./)) {
        req.session.returnTo = req.path;
    }
    else if (req.user &&
        req.path == "/account") {
        req.session.returnTo = req.path;
    }
    next();
});
app.use(express_1.default.static(path_1.default.join(__dirname, "public"), { maxAge: 31557600000 }));
/**
 * Primary app routes.
 */
/**
 * API examples routes.
 */
/**
 * OAuth authentication routes. (Sign in)
 */
/**
 * Daan API routes
 */
app.get("/daan", daanApiController.getProductInfo);
exports.default = app;
//# sourceMappingURL=app.js.map