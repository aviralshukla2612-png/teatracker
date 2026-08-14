# TeaTrack User Flows & Roles

There are two primary roles in the TeaTrack system: **Super Admin** and **Sub Admin**.

## Super Admin Flow

The Super Admin has complete control over the system.

1. **Authentication**: Logs in using `superadmin@teatrack.com`.
2. **Dashboard Management**: 
   - Can see the global dashboard showing the total consumption of tea and coffee.
   - Can add or edit entries for *any* date.
   - Can globally update the **Rates (Per Cup)**. When rates are updated, future entries use the new rates, but past entries preserve the historical rates.
3. **Monthly Summary & Reports**: 
   - Can view the Monthly Summary, filter by month, and export data to Excel (CSV) or PDF.
   - Can view the complete Reports tab with data tables and analytics.
4. **User Management**:
   - Accesses the "Sub Admins" tab.
   - Can create new Sub Admins, edit their names/emails, reset their passwords, and toggle their active/inactive status.

## Sub Admin Flow

The Sub Admin is designed for day-to-day data entry with strict limitations.

1. **Authentication**: Logs in using credentials provided by the Super Admin.
2. **Dashboard Management**:
   - Only sees their *own* entries.
   - Can click "+ Add / Edit Today" to log tea/coffee consumption.
   - **Restriction**: Can ONLY add or edit entries for the **current day**. The date field is locked. They cannot edit past entries.
   - **Restriction**: Can view the Rates, but they are locked (`Read Only`).
3. **Monthly Summary**:
   - Can view a monthly summary of their *own* data.
4. **Access Restrictions**:
   - Does NOT have access to the "Sub Admins" or "Rates & Settings" pages.
