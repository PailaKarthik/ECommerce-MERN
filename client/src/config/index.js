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
      { id: "men", label: "Men" },
      { id: "women", label: "Women" },
      { id: "kids", label: "Kids" },
      { id: "accessories", label: "Accessories" },
      { id: "electronics", label: "Electronics" },
      { id: "footwear", label: "Footwear" },
    ],
    componentType: "select",
  },
  {
    label: "Brand",
    name: "brand",
    type: "select",
    placeholder: "Enter Product Brand",
    options: [
      { id: "adidas", label: "Adidas" },
      { id: "puma", label: "Puma" },
      { id: "nike", label: "Nike" },
      { id: "reebok", label: "Reebok" },
      { id: "vans", label: "Vans" },
      { id: "levi", label: "Levi" },
      { id: "zara", label: "Zara" },
      { id: "patagonia", label: "Patagonia" },
      { id: "other", label: "Other" },
    ],
    componentType: "select",
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
    path: "/shop/listing",
  },
  {
    id: "women",
    label: "Women",
    path: "/shop/listing",
  },
  {
    id: "kids",
    label: "Kids",
    path: "/shop/listing",
  },
  {
    id: "accessories",
    label: "Accessories",
    path: "/shop/listing",
  },
  {
    id: "electronics",
    label: "Electronics",
    path: "/shop/listing",
  },
  {
    id: "footwear",
    label: "Footwear",
    path: "/shop/listing",
  },
  {
    id: "search",
    label: "Search",
    path: "/shop/search",
  },
];

export const filterOptions = {
  category: [
    { id: "men", label: "Men" },
    { id: "women", label: "Women" },
    { id: "kids", label: "Kids" },
    { id: "accessories", label: "Accessories" },
    { id: "electronics", label: "Electronics" },
    { id: "footwear", label: "Footwear" },
  ],
  brand: [
    { id: "adidas", label: "Adidas" },
    { id: "puma", label: "Puma" },
    { id: "nike", label: "Nike" },
    { id: "reebok", label: "Reebok" },
    { id: "levi", label: "Levi" },
    { id: "zara", label: "Zara" },
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
    label : "Address",
    name : "address",
    componentType : "input",
    type : "text",
    placeholder : "Enter your address"
  },
  {
    label : "City",
    name : "city",
    componentType : "input",
    type : "text",
    placeholder : "Enter your City"
  },
  {
    label : "PinCode",
    name : "pincode",
    componentType : "input",
    type : "text",
    placeholder : "Enter your pincode"
  },
  {
    label : "Phone",
    name : "phone",
    componentType : "input",
    type : "text",
    placeholder : "Enter your phone number"
  },
  {
    label : "Notes",
    name : "notes",
    componentType : "textarea",
    placeholder : "Enter your additional notes"
  },
]
