export const registerFormControls = [
  {
    name: "username",
    type: "text",
    label: "User Name",
    placeholder: "Enter your username",
    required: true,
    componentType: "input",
  },
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "Enter your email",
    required: true,
    componentType: "input",
  },
  {
    name: "password",
    type: "password",
    label: "Password",
    placeholder: "Enter your password",
    required: true,
    componentType: "input",
  },
];

export const loginFormControls = [
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "Enter your email",
    required: true,
    componentType: "input",
  },
  {
    name: "password",
    type: "password",
    label: "Password",
    placeholder: "Enter your password",
    required: true,
    componentType: "input",
  },
];

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    type: "text",
    placeholder: "Enter Product Title",
    componentType: "input",
  },
  {
    label: "Description",
    name: "description",
    type: "text",
    placeholder: "Enter Product Description",
    componentType: "textarea",
  },
  {
    label: "Category",
    name: "category",
    type: "select",
    placeholder: "Select Product Category",
    options: [
      { id: "men-shirts", label: "Shirts" },
      { id: "men-pants", label: "Pants" },
      { id: "men-tshirts", label: "Tshirts" },
      { id: "men-shirting", label: "Shirting" },
      { id: "men-suiting", label: "Suiting" },
      { id: "men-jeans", label: "Jeans" },
      { id: "men-trackpants", label: "Track Pants" },
      { id: "accessories", label: "Accessories" },
      { id: "mattress", label: "Mattress" },
    ],
    componentType: "select",
  },
  {
    label: "Brand",
    name: "brand",
    type: "select",
    placeholder: "Enter Product Brand",
    options: [
      { id: "massey", label: "Massey" },
      { id: "linonfeel", label: "Linon Feel" },
      { id: "manwill", label: "Manwill" },
      { id: "jockey", label: "Jockey" },
      { id: "siyaram", label: "Siyaram" },
      { id: "raymond", label: "Raymond" },
      { id: "ramraj", label: "RamRaj" },
      { id: "sambodi", label: "Sambodi" },
      { id: "murarka", label: "Murarka" },
      { id: "solino", label: "Solino" },
      { id: "urbanInspire", label: "Urban Inspire" },
      { id: "others", label: "Others" },
    ],
    componentType: "select",
  },
  {
    label: "Shirt-Sizes",
    name: "tshirtSizes",
    type: "text",
    placeholder: "Enter Shirt sizes with ',' separated. like L=21,M=10,",
    componentType: "textarea",
  },
  {
    label: "Pant-Sizes",
    name: "pantSizes",
    type: "text",
    placeholder: "Enter Pant sizes with ',' separated. like 26=4,28=10,30=34",
    componentType: "textarea",
  },
  {
    label: "Price",
    name: "price",
    type: "number",
    placeholder: "Enter Product Price",
    componentType: "input",
  },

  {
    label: "Sell Price",
    name: "sellPrice",
    type: "number",
    placeholder: "Enter Product Selling Price",
    componentType: "input",
  },
  {
    label: "Quantity",
    name: "quantity",
    type: "number",
    placeholder: "Enter Product Quantity",
    componentType: "input",
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id: "search",
    label: "🔎 Search",
    path: "/shop/search",
  },
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
  },
  {
    id: "products",
    label: "Products",
    path: "/shop/listing",
  },
  {
    id: "men",
    label: "Men",
    subItems : [
      { id: "men-shirts", label: "Shirts", path: "/shop/listing" },
      { id: "men-pants", label: "Pants", path: "/shop/listing" },
      { id: "men-tshirts", label: "Tshirts", path: "/shop/listing" },
      { id: "men-shirting", label: "Shirting", path: "/shop/listing" },
      { id: "men-suiting", label: "Suiting", path: "/shop/listing" },
      { id: "men-jeans", label: "Jeans", path: "/shop/listing" },
      { id: "men-trackpants", label: "Track Pants", path: "/shop/listing" },
    ]
  },
  {
    id: "accessories",
    label: "Accessories",
    path: "/shop/listing",
  },
  {
    id: "mattress",
    label: "Mattress",
    path: "/shop/listing",
  },
  {
    id : "others",
    label: "Others",
    subItems: [
      {id : "shopping-policy", label : "Shopping Policy", path: "/shop/about/shipping-policy" },
      { id: "terms-and-conditions", label: "Terms and Conditions", path: "/shop/about/terms-of-service" },
      { id: "privacy-policy", label: "Privacy Policy", path: "/shop/about/privacy-policy" },
      { id: "about-us", label: "About Us", path: "/shop/about/about-us" },
      { id: "contact-us", label: "Contact Us", path: "/shop/about/contact-us" },
    ]
  }
];

export const filterOptions = {
  category: [
      { id: "men-shirts", label: "Shirts" },
      { id: "men-pants", label: "Pants" },
      { id: "men-tshirts", label: "Tshirts" },
      { id: "men-shirting", label: "Shirting" },
      { id: "men-suiting", label: "Suiting" },
      { id: "men-jeans", label: "Jeans" },
      { id: "men-trackpants", label: "Track Pants" },
      { id: "accessories", label: "Accessories" },
      { id: "mattress", label: "Mattress" },
  ],
  brand: [
    { id: "massey", label: "Massey" },
    { id: "linonfeel", label: "Linon Feel" },
    { id: "manwill", label: "Manwill" },
    { id: "jockey", label: "Jockey" },
    { id: "siyaram", label: "Siyaram" },
    { id: "raymond", label: "Raymond" },
    { id: "ramraj", label: "RamRaj" },
    { id: "sambodi", label: "Sambodi" },
    { id: "murarka", label: "Murarka" },
    { id: "solino", label: "Solino" },
    { id: "urbanInspire", label: "Urban Inspire" },
  ],
};

export const sortOptions = [
  { id: "priceLowToHigh", label: "Price (Low to High)" },
  { id: "priceHighToLow", label: "Price (High to Low)" },
  { id: "title-atoz", label: "Title (A to Z)" },
  { id: "title-ztoa", label: "Title (Z to A)" },
];

export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your City",
  },
  {
    label: "PinCode",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your pincode",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter your additional notes",
  },
];
