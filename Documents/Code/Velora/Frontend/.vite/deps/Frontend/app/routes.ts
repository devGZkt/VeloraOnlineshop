import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/Home.tsx"),

    //Products/Shop Page
    route("products", "routes/Products.tsx"),

    //About Us Page
    route("about", "routes/About.tsx"),

    //Contact Page
    route("contact", "routes/Contact.tsx"),

    //Checkout Page
    route("checkout", "routes/Checkout.tsx"),

    //Auth Pages
    route("signin", "routes/SignIn.tsx"),
    route("signup", "routes/SignUp.tsx"),

    //Admin Page
    route("admin", "routes/Admin.tsx"),
] satisfies RouteConfig;
