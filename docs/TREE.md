│  index.html
│  main.server.ts
│  main.ts
│  server.ts
│  styles.scss
│
├─app
│  │  app.config.server.ts
│  │  app.config.ts
│  │  app.html
│  │  app.routes.server.ts
│  │  app.routes.ts
│  │  app.scss
│  │  app.spec.ts
│  │  app.ts
│  │
│  ├─account
│  │  │  account.component.ts
│  │  │
│  │  └─components
│  │          user-panel.component.html
│  │          user-panel.component.scss
│  │          user-panel.component.ts
│  │
│  ├─admin
│  │  │  admin.module.ts
│  │  │
│  │  └─components
│  │          admin-layout.component.ts
│  │          admin-panel.component.ts
│  │          permission-matrix.component.ts
│  │          permission-matrix.module.ts
│  │          role-management.component.ts
│  │          role-management.module.ts
│  │
│  ├─classes
│  ├─core
│  │  ├─guards
│  │  ├─models
│  │  └─services
│  │          firebase.service.ts
│  │
│  ├─enums
│  ├─features
│  │  ├─account
│  │  └─auth
│  ├─home
│  │      home.component.ts
│  │
│  ├─interfaces
│  ├─layout
│  ├─login
│  │      login.component.ts
│  │
│  ├─shared
│  │      nav-bar.component.ts
│  │
│  ├─users
│  │  │  users.module.ts
│  │  │
│  │  └─containers
│  │      └─users-list
│  │              users-list.component.ts
│  │
│  ├─workspace
│  │  │  workspace.module.ts
│  │  │
│  │  ├─containers
│  │  │      workspace.component.ts
│  │  │
│  │  └─dock
│  │      │  dock.component.html
│  │      │  dock.component.scss
│  │      │  dock.component.ts
│  │      │
│  │      ├─config
│  │      │      dock-menu.config.ts
│  │      │
│  │      ├─models
│  │      │      workspace.types.ts
│  │      │
│  │      ├─services
│  │      │      dock-data.service.ts
│  │      │      dock-state.service.ts
│  │      │
│  │      └─treetable
│  │              treetable.component.html
│  │              treetable.component.scss
│  │              treetable.component.ts
│  │
│  └─workspaces
│          workspaces.component.ts
│
└─environments
        environment.prod.ts
        environment.ts