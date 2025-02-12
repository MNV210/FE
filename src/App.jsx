import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { ThemeProvider } from "@/contexts/theme-context";

import Layout from "@/routes/layout";
// import DashboardPage from "@/routes/dashboard/page";
import CourseList from "./routes/home/CourseList";
import CoursePage from "./routes/courses/CoursePage";
import { CourseCurriculum } from "./routes/courses/CourseInfomation";
import LearnPage from "./routes/courses/LearnPage";
import { ListExercise } from "./routes/exercise/ListExercise";
import { MakeExercise } from "./routes/exercise/MakeExercise";
import TestResult from "./routes/exercise/TestResult";
import {ProfilePage} from "./routes/user/ProfilePage";
 // Import ExerciseInfoPage

function App() {
    const router = createBrowserRouter([
        // {
        //     path: "/login", // Move login path outside of layout
        //     element: <LoginPage />, // Add LoginPage element
        // },
        {
            path: "/",
            element: <Layout />,
            children: [
                {
                    index: true,
                    element: <CourseList />,
                },
                {
                    path: "courses",
                    index: true,
                    element: <CoursePage />,
                },
                {
                    path: "courses/:courseId",
                    element: <CourseCurriculum />
                },
                {
                    path:`/learn/:slug/:lessonId`,
                    element: <LearnPage/>
                },
                {
                    path:`/bai-kiem-tra`,
                    element: <ListExercise/>
                },
                {
                    path:`/quiz/:exerciseId`,
                    element: <MakeExercise/>
                },
                {
                    path:`/exercise_result/:exerciseId`,
                    element:<TestResult/>
                },
                {
                    path: "/profile",
                    element: <ProfilePage />,
                }
            ],
            
        },
    ]);

    return (
        <ThemeProvider storageKey="theme">
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;
