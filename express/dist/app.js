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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const cors_1 = __importDefault(require("cors"));
const express_oauth2_jwt_bearer_1 = require("express-oauth2-jwt-bearer");
const prisma = new client_1.PrismaClient();
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
const checkJwt = (0, express_oauth2_jwt_bearer_1.auth)({
    audience: 'http://localhost:3001/',
    issuerBaseURL: `https://dev-lqrmsqwllauuo8yp.uk.auth0.com/`,
});
const cookieSchema = zod_1.z.string().length(36);
const idSchema = zod_1.z.coerce.number().int();
const titleSchema = zod_1.z.string().min(1);
const messageSchema = zod_1.z.string().min(1);
const completeSchema = zod_1.z.coerce.number().min(0).max(1);
const listTitleSchema = zod_1.z.array(zod_1.z.object({
    id: zod_1.z.number().int(),
    cookieId: zod_1.z.string(),
    createdAt: zod_1.z.coerce.date(),
    title: zod_1.z.string(),
}));
const listItemsSchema = zod_1.z.array(zod_1.z.object({
    id: zod_1.z.number().int(),
    cookieId: zod_1.z.string(),
    titleId: zod_1.z.coerce.number().int(),
    createdAt: zod_1.z.coerce.date(),
    message: zod_1.z.string(),
    complete: zod_1.z.boolean(),
}));
const deleteItemsSchema = zod_1.z.object({
    count: zod_1.z.number().min(0),
});
const singleTitleSchema = zod_1.z.object({
    id: zod_1.z.number().int(),
    cookieId: zod_1.z.string(),
    createdAt: zod_1.z.coerce.date(),
    title: zod_1.z.string(),
});
const singleItemSchema = zod_1.z.object({
    id: zod_1.z.number().int(),
    cookieId: zod_1.z.string(),
    titleId: zod_1.z.coerce.number().int(),
    createdAt: zod_1.z.coerce.date(),
    message: zod_1.z.string(),
    complete: zod_1.z.boolean(),
});
// Allowing all cors for now as causing client side next access issues
app.use((0, cors_1.default)());
// Fetch all listTitles for user using cookieId
app.get('/fetchLists/', checkJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    function getLists() {
        return __awaiter(this, void 0, void 0, function* () {
            cookieSchema.parse(req.query.cookieId);
            if (typeof req.query.cookieId === 'string') {
                const allTitles = yield prisma.listTitle.findMany({
                    where: { cookieId: req.query.cookieId },
                });
                listTitleSchema.parse(allTitles);
                res.json({
                    listTitles: allTitles,
                });
                if (req.query.test) {
                }
            }
        });
    }
    getLists()
        .then(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }))
        .catch((err) => __awaiter(void 0, void 0, void 0, function* () {
        console.error(err);
        yield prisma.$disconnect();
        res.status(500).json({ error: 'error requesting data' });
        process.exit(1);
    }));
}));
// Fetch all listItems from a titleId
app.get('/fetchItems/', checkJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    function getItems() {
        return __awaiter(this, void 0, void 0, function* () {
            idSchema.parse(req.query.titleId);
            cookieSchema.parse(req.query.cookieId);
            if (typeof req.query.titleId === 'string' &&
                typeof req.query.cookieId === 'string') {
                const allItems = yield prisma.listItems.findMany({
                    where: {
                        titleId: parseInt(req.query.titleId),
                        cookieId: req.query.cookieId,
                    },
                });
                listItemsSchema.parse(allItems);
                res.json({
                    listItems: allItems,
                });
            }
        });
    }
    getItems()
        .then(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }))
        .catch((err) => __awaiter(void 0, void 0, void 0, function* () {
        console.error(err);
        yield prisma.$disconnect();
        process.exit(1);
    }));
}));
// Create new listTitle from a cookieId and title
app.post('/createTitle/', checkJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    function createTitle() {
        return __awaiter(this, void 0, void 0, function* () {
            cookieSchema.parse(req.query.cookieId);
            titleSchema.parse(req.query.title);
            if (typeof req.query.cookieId === 'string' &&
                typeof req.query.title === 'string') {
                const newTitle = yield prisma.listTitle.create({
                    data: {
                        cookieId: req.query.cookieId,
                        title: req.query.title,
                    },
                });
                singleTitleSchema.parse(newTitle);
                res.sendStatus(200);
            }
        });
    }
    createTitle()
        .then(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }))
        .catch((err) => __awaiter(void 0, void 0, void 0, function* () {
        console.error(err);
        yield prisma.$disconnect();
        process.exit(1);
    }));
}));
// Create new listItem from a titleId and message
app.post('/createItem/', checkJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    function createItem() {
        return __awaiter(this, void 0, void 0, function* () {
            idSchema.parse(req.query.titleId);
            messageSchema.parse(req.query.message);
            cookieSchema.parse(req.query.cookieId);
            if (typeof req.query.titleId === 'string' &&
                typeof req.query.message === 'string' &&
                typeof req.query.cookieId === 'string') {
                const newItem = yield prisma.listItems.create({
                    data: {
                        titleId: parseInt(req.query.titleId),
                        message: req.query.message,
                        cookieId: req.query.cookieId,
                    },
                });
                singleItemSchema.parse(newItem);
                res.sendStatus(200);
            }
        });
    }
    createItem()
        .then(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }))
        .catch((err) => __awaiter(void 0, void 0, void 0, function* () {
        console.error(err);
        yield prisma.$disconnect();
        process.exit(1);
    }));
}));
// Delete listTitle from a id
app.delete('/deleteTitle/', checkJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    function deleteTitle() {
        return __awaiter(this, void 0, void 0, function* () {
            idSchema.parse(req.query.id);
            cookieSchema.parse(req.query.cookieId);
            if (typeof req.query.id === 'string' &&
                typeof req.query.cookieId === 'string') {
                const deletedItems = yield prisma.listItems.deleteMany({
                    where: {
                        titleId: parseInt(req.query.id),
                        cookieId: req.query.cookieId,
                    },
                });
                if (typeof deletedItems === 'object') {
                    deleteItemsSchema.parse(deletedItems);
                }
                const deletedTitle = yield prisma.listTitle.delete({
                    where: {
                        id: parseInt(req.query.id),
                        cookieId: req.query.cookieId,
                    },
                });
                singleTitleSchema.parse(deletedTitle);
                res.sendStatus(200);
            }
        });
    }
    deleteTitle()
        .then(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }))
        .catch((err) => __awaiter(void 0, void 0, void 0, function* () {
        console.error(err);
        yield prisma.$disconnect();
        process.exit(1);
    }));
}));
// Delete listTitle from an id
app.delete('/deleteItem/', checkJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    function deleteItem() {
        return __awaiter(this, void 0, void 0, function* () {
            idSchema.parse(req.query.id);
            cookieSchema.parse(req.query.cookieId);
            if (typeof req.query.id === 'string' &&
                typeof req.query.cookieId === 'string') {
                const deletedItem = yield prisma.listItems.delete({
                    where: {
                        id: parseInt(req.query.id),
                        cookieId: req.query.cookieId,
                    },
                });
                singleItemSchema.parse(deletedItem);
                res.sendStatus(200);
            }
        });
    }
    deleteItem()
        .then(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }))
        .catch((err) => __awaiter(void 0, void 0, void 0, function* () {
        console.error(err);
        yield prisma.$disconnect();
        process.exit(1);
    }));
}));
// Patch to invert complete state of listItem using an id and boolean
app.patch('/complete/', checkJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    function completedItem() {
        return __awaiter(this, void 0, void 0, function* () {
            idSchema.parse(req.query.id);
            cookieSchema.parse(req.query.cookieId);
            completeSchema.parse(req.query.completeBool);
            if (typeof req.query.id === 'string' &&
                typeof req.query.completeBool === 'string' &&
                typeof req.query.cookieId === 'string') {
                const completedItem = yield prisma.listItems.update({
                    where: {
                        id: parseInt(req.query.id),
                        cookieId: req.query.cookieId,
                    },
                    data: {
                        complete: Boolean(parseInt(req.query.completeBool)),
                    },
                });
                singleItemSchema.parse(completedItem);
                res.sendStatus(200);
            }
        });
    }
    completedItem()
        .then(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }))
        .catch((err) => __awaiter(void 0, void 0, void 0, function* () {
        console.error(err);
        yield prisma.$disconnect();
        process.exit(1);
    }));
}));
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
