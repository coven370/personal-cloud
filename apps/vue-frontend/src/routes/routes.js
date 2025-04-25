import Vue from 'vue';
import Router from 'vue-router';

import Login from '@/pages/LoginPage.vue'
import CreateAccount from '@/pages/CreateAccount.vue'
import DashboardLayout from "@/pages/layout/DashboardLayout.vue";
import Home from '@/pages/HomePage.vue';
import Directory from "@/pages/DirectoryPage.vue";
import MyFiles from "@/pages/MyFiles.vue";
import Upload from "@/pages/UploadPage.vue";
import Download from "@/pages/DownloadPage.vue";
import Encrypt from "@/pages/EncryptPage.vue";
import Share from "@/pages/SharePage.vue";
import ManageAccount from "@/pages/ManageAccount.vue";
import FilePreview from "@/pages/FilePreview.vue"
import SharedFile from "@/pages/SharedFile.vue";

Vue.use(Router);

export default new Router({
    mode: 'history', // Removes hash from URL (e.g., /login instead of #/login)
    routes: [
        {
            path: '/',
            redirect: '/dashboard/home' // Redirect the home page to Login
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/createAccount',
            name: 'CreateAccount',
            component: CreateAccount
        },
        {
            path: '/sharedFile',
            name: 'SharedFile',
            component: SharedFile
        },
        {
            path: '/dashboard',
            redirect: '/dashboard/home',
            component: DashboardLayout,
            children: [
                {
                    path: 'home',
                    name: 'Home',
                    component: Home
                },
                {
                    path: 'directory',
                    name: 'Directory',
                    component: Directory
                },
                {
                    path: 'myFiles',
                    name: 'MyFiles',
                    component: MyFiles
                },
                {
                    path: 'upload',
                    name: 'Upload',
                    component: Upload
                },
                {
                    path: 'download',
                    name: 'Download',
                    component: Download
                },
                {
                    path: 'encrypt',
                    name: 'Encrypt',
                    component: Encrypt
                },
                {
                    path: 'share',
                    name: 'Share',
                    component: Share
                },
                {
                    path: 'manageAccount',
                    name: 'ManageAccount',
                    component: ManageAccount
                },
                {
                    path: 'filePreview',
                    name: 'FilePreview',
                    component: FilePreview
                },
            ]
        },
/*        {
            path: '/dashboard',
            name: 'Dashboard',
            component: Dashboard
        }*/
    ]
});
