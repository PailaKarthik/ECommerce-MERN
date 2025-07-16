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
      { id: "clothing", label: "Clothing" },
      { id: "combo", label: "Combo" },
      { id: "men", label: "Men" },
      { id: "accessories", label: "Accessories" },
      { id: "electronics", label: "Electronics" },
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
    label: "Ϙ Search",
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
    id: "clothing",
    label: "Clothing",
    path: "/shop/listing",
  },
  {
    id: "combo",
    label: "Combo",
    path: "/shop/listing",
  },
  {
    id: "men",
    label: "Men",
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
];

export const filterOptions = {
  category: [
    { id: "clothing", label: "Clothing" },
    { id: "combo", label: "Combo" },
    { id: "men", label: "Men" },
    { id: "accessories", label: "Accessories" },
    { id: "electronics", label: "Electronics" },
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
