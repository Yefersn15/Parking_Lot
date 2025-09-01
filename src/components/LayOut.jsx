import { ThemeProvider } from "./ThemeContext";
import Header from './Header';
import Footer from './Footer';


const Layout = ({ children }) => {
    return (
        <>
            <ThemeProvider>
                <Header />
                <main>
                    {children}
                </main>
                <Footer />
            </ThemeProvider>
        </>
    );
};
export default Layout;