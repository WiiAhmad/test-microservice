import { Outlet } from 'react-router'

export default function RootLayout() {
    return (
        <div className="min-h-screen bg-background">
            {/* You can add global layout elements here like header, nav, footer */}
            {/* <header>
        <nav>...</nav>
      </header> */}

            <main>
                {/* This will render the matched child route */}
                <Outlet />
            </main>

            {/* <footer>...</footer> */}
        </div>
    )
}