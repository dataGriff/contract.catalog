# Architecture Overview

This document provides a comprehensive visual representation of the Contract Catalog architecture, including domains, services, and their interactions.

## Table of Contents

- [System Overview](#system-overview)
- [Domain Architecture](#domain-architecture)
- [Service Interactions](#service-interactions)
- [Event-Driven Architecture](#event-driven-architecture)
- [API Integration Patterns](#api-integration-patterns)
- [Data Flow](#data-flow)

## System Overview

The Contract Catalog demonstrates a microservices architecture organized into two primary domains:

```mermaid
graph TB
    subgraph "User Management Domain"
        US[User Service]
        AS[Auth Service]
    end
    
    subgraph "Order Management Domain"
        OS[Order Service]
        PS[Payment Service]
    end
    
    subgraph "Infrastructure"
        API[API Gateway]
        KAFKA[Kafka Event Bus]
        DB[(Databases)]
    end
    
    API --> US
    API --> AS
    API --> OS
    API --> PS
    
    US -.->|Events| KAFKA
    OS -.->|Events| KAFKA
    PS -.->|Events| KAFKA
    
    US --> DB
    AS --> DB
    OS --> DB
    PS --> DB
    
    OS -.->|References| US
    PS -.->|References| OS
    PS -.->|References| US
    
    style US fill:#e1f5ff
    style AS fill:#e1f5ff
    style OS fill:#fff4e1
    style PS fill:#fff4e1
    style KAFKA fill:#f0f0f0
```

### Key Components

- **User Management Domain**: Handles user identity, authentication, and user data
- **Order Management Domain**: Manages order processing, payments, and fulfillment
- **Event Bus**: Enables asynchronous communication between services via Kafka
- **API Gateway**: Centralized entry point for all client requests

## Domain Architecture

### User Management Domain

The User Management domain provides user identity and authentication services.

```mermaid
graph LR
    subgraph "User Management Domain"
        direction TB
        US[User Service]
        AS[Auth Service]
        UD[(User Database)]
        
        US -->|CRUD Operations| UD
        AS -->|Authenticate| UD
        US -.->|Publishes| UE[User Events]
        
        subgraph "APIs"
            UAPI[User API<br/>OpenAPI]
            AAPI[Auth API<br/>OpenAPI]
        end
        
        subgraph "Events"
            UE[User Events<br/>AsyncAPI]
        end
        
        subgraph "Data"
            UC[User Contract<br/>ODCS]
        end
        
        US --> UAPI
        AS --> AAPI
    end
    
    style US fill:#4a90e2
    style AS fill:#4a90e2
    style UAPI fill:#90EE90
    style AAPI fill:#90EE90
    style UE fill:#FFB347
    style UC fill:#DDA0DD
```

**Services:**
- **User Service**: Manages user profiles, registration, and user data
- **Auth Service**: Handles authentication, authorization, and session management

**Contracts:**
- `user-api.yaml` - REST API for user CRUD operations
- `auth-api.yaml` - REST API for authentication
- `user-events.yaml` - User lifecycle events (created, updated, deleted)
- `user-contract.yaml` - User data schema and quality rules

### Order Management Domain

The Order Management domain handles order processing and payment transactions.

```mermaid
graph LR
    subgraph "Order Management Domain"
        direction TB
        OS[Order Service]
        PS[Payment Service]
        OD[(Order Database)]
        PD[(Payment Database)]
        
        OS -->|Store Orders| OD
        PS -->|Store Payments| PD
        OS -.->|Publishes| OE[Order Events]
        PS -.->|Publishes| PE[Payment Events]
        
        subgraph "APIs"
            OAPI[Order API<br/>OpenAPI]
            PAPI[Payment API<br/>OpenAPI]
        end
        
        subgraph "Events"
            OE[Order Events<br/>AsyncAPI]
            PE[Payment Events<br/>AsyncAPI]
        end
        
        subgraph "Data"
            OC[Order Contract<br/>ODCS]
        end
        
        OS --> OAPI
        PS --> PAPI
    end
    
    style OS fill:#e67e22
    style PS fill:#e67e22
    style OAPI fill:#90EE90
    style PAPI fill:#90EE90
    style OE fill:#FFB347
    style PE fill:#FFB347
    style OC fill:#DDA0DD
```

**Services:**
- **Order Service**: Manages order lifecycle, inventory, and fulfillment
- **Payment Service**: Processes payments, refunds, and payment reconciliation

**Contracts:**
- `order-api.yaml` - REST API for order management
- `payment-api.yaml` - REST API for payment processing
- `order-events.yaml` - Order lifecycle events (created, confirmed, shipped, etc.)
- `payment-events.yaml` - Payment events (processed, failed, refunded)
- `order-contract.yaml` - Order data schema and quality rules

## Service Interactions

### Cross-Domain Service Communication

```mermaid
sequenceDiagram
    participant Client
    participant API Gateway
    participant User Service
    participant Order Service
    participant Payment Service
    participant Kafka
    
    Note over Client,Kafka: User Registration and Order Flow
    
    Client->>API Gateway: 1. Create User
    API Gateway->>User Service: POST /users
    User Service->>Kafka: Publish user.created
    User Service-->>API Gateway: User Created (201)
    API Gateway-->>Client: User Response
    
    Note over Client,Kafka: Order Creation Flow
    
    Client->>API Gateway: 2. Create Order
    API Gateway->>Order Service: POST /orders
    Order Service->>User Service: Validate userId (cross-domain)
    User Service-->>Order Service: User Valid
    Order Service->>Kafka: Publish order.created
    Order Service-->>API Gateway: Order Created (201)
    API Gateway-->>Client: Order Response
    
    Note over Client,Kafka: Payment Processing Flow
    
    Client->>API Gateway: 3. Process Payment
    API Gateway->>Payment Service: POST /payments
    Payment Service->>Order Service: Validate orderId (cross-domain)
    Order Service-->>Payment Service: Order Valid
    Payment Service->>Kafka: Publish payment.processed
    Payment Service-->>API Gateway: Payment Success (200)
    API Gateway-->>Client: Payment Response
    
    Note over Order Service,Kafka: Event-Driven Status Update
    
    Kafka->>Order Service: Consume payment.processed
    Order Service->>Order Service: Update order status
    Order Service->>Kafka: Publish order.confirmed
```

### Key Integration Points

1. **Synchronous API Calls**: Services validate cross-domain references via REST APIs
2. **Asynchronous Events**: State changes are communicated via Kafka events
3. **Data References**: Services reference entities from other domains (e.g., userId, orderId)

## Event-Driven Architecture

### Event Flow Diagram

```mermaid
graph TB
    subgraph "Event Publishers"
        US[User Service]
        OS[Order Service]
        PS[Payment Service]
    end
    
    subgraph "Kafka Event Bus"
        UT[user.created<br/>user.updated<br/>user.deleted]
        OT[order.created<br/>order.confirmed<br/>order.shipped<br/>order.delivered<br/>order.cancelled]
        PT[payment.processed<br/>payment.failed<br/>payment.refunded]
    end
    
    subgraph "Event Consumers"
        NS[Notification Service]
        OS2[Order Service]
        AS2[Analytics Service]
        ACC[Accounting Service]
    end
    
    US -->|Publishes| UT
    OS -->|Publishes| OT
    PS -->|Publishes| PT
    
    UT -->|Subscribes| NS
    UT -->|Subscribes| AS2
    
    OT -->|Subscribes| NS
    OT -->|Subscribes| AS2
    OT -->|Subscribes| ACC
    
    PT -->|Subscribes| OS2
    PT -->|Subscribes| NS
    PT -->|Subscribes| AS2
    PT -->|Subscribes| ACC
    
    style US fill:#4a90e2
    style OS fill:#e67e22
    style PS fill:#e67e22
    style UT fill:#FFB347
    style OT fill:#FFB347
    style PT fill:#FFB347
```

### Event Catalog

#### User Management Events
- **user.created** - Published when a new user registers
- **user.updated** - Published when user profile is modified
- **user.deleted** - Published when user account is removed

#### Order Management Events
- **order.created** - Published when a new order is placed
- **order.confirmed** - Published when payment is confirmed
- **order.shipped** - Published when order is dispatched
- **order.delivered** - Published when order reaches customer
- **order.cancelled** - Published when order is cancelled

#### Payment Events
- **payment.processed** - Published when payment succeeds
- **payment.failed** - Published when payment fails
- **payment.refunded** - Published when payment is refunded

## API Integration Patterns

### REST API Communication Pattern

```mermaid
graph LR
    subgraph "Client Applications"
        WEB[Web App]
        MOBILE[Mobile App]
        PARTNER[Partner API]
    end
    
    subgraph "API Layer"
        GW[API Gateway]
    end
    
    subgraph "Service Layer"
        US[User Service<br/>user-api.yaml]
        AS[Auth Service<br/>auth-api.yaml]
        OS[Order Service<br/>order-api.yaml]
        PS[Payment Service<br/>payment-api.yaml]
    end
    
    WEB --> GW
    MOBILE --> GW
    PARTNER --> GW
    
    GW --> US
    GW --> AS
    GW --> OS
    GW --> PS
    
    OS -.->|GET /users/{id}| US
    PS -.->|GET /orders/{id}| OS
    PS -.->|GET /users/{id}| US
    
    style GW fill:#f39c12
    style US fill:#4a90e2
    style AS fill:#4a90e2
    style OS fill:#e67e22
    style PS fill:#e67e22
```

### Contract Types by Service

| Service | OpenAPI | AsyncAPI | ODCS Data Contract |
|---------|---------|----------|-------------------|
| User Service | ✅ user-api.yaml | ✅ user-events.yaml | ✅ user-contract.yaml |
| Auth Service | ✅ auth-api.yaml | ❌ | ❌ |
| Order Service | ✅ order-api.yaml | ✅ order-events.yaml | ✅ order-contract.yaml |
| Payment Service | ✅ payment-api.yaml | ✅ payment-events.yaml | ❌ |

## Data Flow

### Order Processing Data Flow

```mermaid
flowchart TD
    Start([Client Initiates Order]) --> ValidateUser{User Exists?}
    ValidateUser -->|Yes| CreateOrder[Order Service<br/>Creates Order]
    ValidateUser -->|No| Error1[Return 400 Error]
    
    CreateOrder --> PublishOrderCreated[Publish order.created Event]
    PublishOrderCreated --> ProcessPayment[Payment Service<br/>Processes Payment]
    
    ProcessPayment --> PaymentSuccess{Payment<br/>Successful?}
    
    PaymentSuccess -->|Yes| PublishPaymentProcessed[Publish payment.processed]
    PaymentSuccess -->|No| PublishPaymentFailed[Publish payment.failed]
    
    PublishPaymentProcessed --> UpdateOrderConfirmed[Order Service Consumes Event<br/>Updates Status to Confirmed]
    PublishPaymentFailed --> UpdateOrderFailed[Order Service Consumes Event<br/>Updates Status to Failed]
    
    UpdateOrderConfirmed --> PublishOrderConfirmed[Publish order.confirmed]
    UpdateOrderFailed --> NotifyCustomer1[Notify Customer]
    
    PublishOrderConfirmed --> ShipOrder[Fulfill Order]
    ShipOrder --> PublishOrderShipped[Publish order.shipped]
    PublishOrderShipped --> NotifyCustomer2[Notify Customer]
    NotifyCustomer2 --> End([Order Complete])
    
    style CreateOrder fill:#e67e22
    style ProcessPayment fill:#e67e22
    style UpdateOrderConfirmed fill:#e67e22
    style PublishOrderCreated fill:#FFB347
    style PublishPaymentProcessed fill:#FFB347
    style PublishOrderConfirmed fill:#FFB347
    style PublishOrderShipped fill:#FFB347
```

### Cross-Domain Data References

```mermaid
erDiagram
    USER ||--o{ ORDER : places
    ORDER ||--o{ ORDER_ITEM : contains
    ORDER ||--|| PAYMENT : "paid by"
    
    USER {
        string id PK
        string email
        string name
        datetime createdAt
    }
    
    ORDER {
        string id PK
        string userId FK "Reference to User"
        string status
        decimal totalAmount
        string currency
        datetime createdAt
    }
    
    ORDER_ITEM {
        string id PK
        string orderId FK
        string productId
        int quantity
        decimal price
        decimal subtotal
    }
    
    PAYMENT {
        string id PK
        string orderId FK "Reference to Order"
        string userId FK "Reference to User"
        decimal amount
        string currency
        string status
        datetime processedAt
    }
```

**Cross-Domain References:**
- Orders reference Users via `userId` (User Management → Order Management)
- Payments reference both Orders via `orderId` and Users via `userId`
- Events carry cross-domain identifiers for event consumers

## Contract-Driven Development

### Contract Catalog Approach

```mermaid
graph TB
    subgraph "Contract Definition Phase"
        OAS[Define OpenAPI<br/>API Contracts]
        ASYNC[Define AsyncAPI<br/>Event Contracts]
        ODCS[Define ODCS<br/>Data Contracts]
    end
    
    subgraph "Validation Phase"
        LINT[Spectral Linting]
        VALIDATE[Contract Validation]
    end
    
    subgraph "Generation Phase"
        GEN[Generate Static Site]
        DOCS[Interactive Documentation]
    end
    
    subgraph "Implementation Phase"
        API_IMPL[Implement APIs]
        EVENT_IMPL[Implement Events]
        DATA_IMPL[Implement Data Layer]
    end
    
    subgraph "Testing Phase"
        CONTRACT_TEST[Contract Testing]
        INTEGRATION_TEST[Integration Testing]
    end
    
    OAS --> LINT
    ASYNC --> LINT
    ODCS --> VALIDATE
    
    LINT --> GEN
    VALIDATE --> GEN
    
    GEN --> DOCS
    DOCS --> API_IMPL
    DOCS --> EVENT_IMPL
    DOCS --> DATA_IMPL
    
    API_IMPL --> CONTRACT_TEST
    EVENT_IMPL --> CONTRACT_TEST
    DATA_IMPL --> CONTRACT_TEST
    
    CONTRACT_TEST --> INTEGRATION_TEST
    
    style OAS fill:#90EE90
    style ASYNC fill:#FFB347
    style ODCS fill:#DDA0DD
    style GEN fill:#f39c12
```

### Benefits

1. **Design First**: Contracts are defined before implementation
2. **Documentation**: Automatically generated, always up-to-date
3. **Validation**: Contracts are validated before deployment
4. **Collaboration**: Teams can work independently using contracts
5. **Testing**: Contract tests ensure compatibility

## Deployment Architecture

```mermaid
graph TB
    subgraph "Production Environment"
        subgraph "Kubernetes Cluster"
            US_POD[User Service Pods]
            AS_POD[Auth Service Pods]
            OS_POD[Order Service Pods]
            PS_POD[Payment Service Pods]
        end
        
        subgraph "Data Layer"
            USER_DB[(User DB)]
            ORDER_DB[(Order DB)]
            PAYMENT_DB[(Payment DB)]
        end
        
        subgraph "Messaging Layer"
            KAFKA_CLUSTER[Kafka Cluster]
        end
        
        LB[Load Balancer]
        API_GW[API Gateway]
    end
    
    subgraph "External"
        INTERNET([Internet])
    end
    
    INTERNET --> LB
    LB --> API_GW
    API_GW --> US_POD
    API_GW --> AS_POD
    API_GW --> OS_POD
    API_GW --> PS_POD
    
    US_POD --> USER_DB
    AS_POD --> USER_DB
    OS_POD --> ORDER_DB
    PS_POD --> PAYMENT_DB
    
    US_POD -.-> KAFKA_CLUSTER
    OS_POD -.-> KAFKA_CLUSTER
    PS_POD -.-> KAFKA_CLUSTER
    
    style LB fill:#f39c12
    style API_GW fill:#f39c12
    style KAFKA_CLUSTER fill:#9b59b6
```

## Technology Stack

### Service Technologies
- **Programming Languages**: Node.js (TypeScript), Python, Go (varies by service)
- **API Framework**: Express.js, FastAPI, Gin
- **Documentation**: Contract Catalog (OpenAPI, AsyncAPI, ODCS)

### Infrastructure
- **Container Orchestration**: Kubernetes
- **Message Broker**: Apache Kafka
- **Databases**: PostgreSQL (transactional), MongoDB (document store)
- **API Gateway**: Kong, AWS API Gateway
- **Service Mesh**: Istio (optional)

### Contract Tools
- **Contract Catalog**: This repository - static site generator
- **OpenAPI**: Redoc for interactive API documentation
- **AsyncAPI**: AsyncAPI Generator with HTML template
- **ODCS**: datacontract-cli for data contract rendering
- **Validation**: Spectral for contract linting

## Next Steps

To extend this architecture:

1. **Add New Domains**: Create new domain directories under `contracts/`
2. **Add New Services**: Create service directories within domains
3. **Define Contracts**: Add OpenAPI, AsyncAPI, and ODCS contracts
4. **Update Architecture**: Update this document with new domains/services
5. **Generate Docs**: Run `npm run generate` to update documentation

## Resources

- [Main README](README.md) - Quick start and usage guide
- [OpenAPI Specification](https://swagger.io/specification/)
- [AsyncAPI Specification](https://www.asyncapi.com/docs/reference/specification/v2.6.0)
- [Open Data Contract Standard](https://github.com/bitol-io/open-data-contract-standard)
- [Contract Catalog Generator](src/generators/site-generator.ts)
