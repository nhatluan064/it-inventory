import React from "react";

const AppContext = React.createContext({
  theme: "light",
  setTheme: () => {},
  language: "vi",
  setLanguage: () => {},
  t: (key) => key, // Hàm dịch thuật
});

export default AppContext;
