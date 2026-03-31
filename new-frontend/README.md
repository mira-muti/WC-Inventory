# WCInventory Frontend

The Welcome Collective Inventory Frontend is an
inventory management application for the Welcome Collective.

## Get Started

1. Clone the repository and navigate to the `/new-frontend` directory:

   ```bash
   git clone https://github.com/hack4impact-mcgill/wc-inventory.git
   cd new-frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   The app should now be running on [localhost:3000](http://localhost:3000).

---

## Project Structure

- **`/assets`**: Static assets used across the application.
- **`/components`**: Reusable UI components.
- **`/contexts`**: Contexts for application-wide state management, such as authentication.
- **`/features`**: Grouped features for distinct sections,
  such as `admin-dashboard` and `volunteer-dashboard`.
- **`/hooks`**: Custom hooks to abstract common logic.
- **`/lib`**: Utility files, including API functions.
- **`/providers`**: Providers for third-party libraries,
  including React Query and our Router.
- **`/types`**: Type definitions for structured data and our supabase exported schema.

---

## Technologies

- **Supabase**: Used for DB and authentication services.
  For more information, visit [Supabase](https://supabase.com/).
- **TailwindCSS**: Utility-first CSS framework for styling.
  For more information, visit [TailwindCSS](https://tailwindcss.com/).
- **shadcn/ui**: Styled component library providing reusable UI elements,
  built on top of TailwindCSS.
  Learn more at [shadcn](https://shadcn.dev/).

---

## Scripts

- **`npm install`**: Installs dependencies
- **`npm run dev`**: Starts the development server.

---

## Contributing

1. **Fork the repository** and create a story branch, where # is the number of your ticket:

   ```bash
   git checkout -b WC-##
   ```

2. **Stage and commit your changes**:

   ```bash
   git add .
   git commit -m "[WC-#] Add your feature"
   ```

3. **Push to your branch** and then create a pull request:

   ```bash
   git push origin WC-#
   ```
