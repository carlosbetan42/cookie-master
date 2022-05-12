import { ChangeEvent, FC, useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { Button, Card, CardContent, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { Layout } from "../components/layouts";

interface Props {
  theme: string;
}

const ThemeChangerPage: FC<Props> = ({ theme }) => {
  const [currentTheme, setCurrentTheme] = useState(theme);

  const onThemeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedTheme = event.target.value;
    setCurrentTheme(selectedTheme);

    localStorage.setItem("theme", selectedTheme);
    Cookies.set("theme", selectedTheme);
  };

  const onClick = async () => {
    const { data } = await axios.get("/api/hello");
    console.log({ data });
  };

  useEffect(() => {
    console.log("LocalStorage:", localStorage.getItem("theme"));
    console.log("Cookies:", Cookies.get("theme"));
  }, []);

  return (
    <Layout>
      <Card>
        <CardContent>
          <FormControl>
            <FormLabel>Tema</FormLabel>
            <RadioGroup value={currentTheme} onChange={onThemeChange}>
              <FormControlLabel value='light' control={<Radio />} label='Light'></FormControlLabel>
              <FormControlLabel value='dark' control={<Radio />} label='Dark'></FormControlLabel>
              <FormControlLabel value='custom' control={<Radio />} label='Custom'></FormControlLabel>
            </RadioGroup>
          </FormControl>
        </CardContent>

        <Button onClick={onClick}>Solicitud</Button>
      </Card>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { theme = "light", name = "No name" } = req.cookies;

  const validThemes = ["light", "dark", "custom"];

  return {
    props: {
      theme: validThemes.includes(theme) ? theme : "dark",
      name,
    },
  };
};

export default ThemeChangerPage;
