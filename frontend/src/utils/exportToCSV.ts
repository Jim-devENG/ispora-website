/**
 * Utility functions for exporting data to CSV format
 */

/**
 * Convert an array of objects to CSV format
 */
export function convertToCSV(data: any[], headers: string[]): string {
  if (!data || data.length === 0) {
    return headers.join(',');
  }

  // Create CSV rows
  const rows = [
    headers.join(','), // Header row
    ...data.map(item => {
      return headers.map(header => {
        const value = getNestedValue(item, header);
        // Escape commas, quotes, and newlines in CSV
        if (value === null || value === undefined) {
          return '';
        }
        const stringValue = String(value);
        // If value contains comma, quote, or newline, wrap in quotes and escape quotes
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',');
    })
  ];

  return rows.join('\n');
}

/**
 * Get nested value from object using dot notation (e.g., "location.city")
 */
function getNestedValue(obj: any, path: string): any {
  const keys = path.split('.');
  let value = obj;
  for (const key of keys) {
    if (value === null || value === undefined) {
      return '';
    }
    value = value[key];
  }
  return value || '';
}

/**
 * Download CSV file
 */
export function downloadCSV(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  URL.revokeObjectURL(url);
}

/**
 * Export registrations to CSV
 */
export function exportRegistrationsToCSV(registrations: any[]) {
  const headers = [
    'Name',
    'Email',
    'WhatsApp',
    'Country of Residence',
    'Country of Origin',
    'Group',
    'Status',
    'City',
    'LinkedIn',
    'Current Work',
    'Field of Study',
    'Background',
    'Contribution Interest',
    'Areas of Interest',
    'Other Interest',
    'State/Region',
    'Age Range',
    'Expectations',
    'Created At'
  ];

  const csvData = registrations.map(reg => ({
    'Name': reg.name || '',
    'Email': reg.email || '',
    'WhatsApp': reg.whatsapp || '',
    'Country of Residence': reg.countryOfResidence || '',
    'Country of Origin': reg.countryOfOrigin || '',
    'Group': reg.group || '',
    'Status': reg.status || '',
    'City': reg.location?.city || '',
    'LinkedIn': reg.location?.linkedin || '',
    'Current Work': reg.location?.currentWork || '',
    'Field of Study': reg.location?.fieldOfStudy || '',
    'Background': reg.location?.background || '',
    'Contribution Interest': reg.location?.contributeInterest || '',
    'Areas of Interest': Array.isArray(reg.location?.areasOfInterest) 
      ? reg.location.areasOfInterest.join('; ') 
      : (Array.isArray(reg.location?.interests) ? reg.location.interests.join('; ') : ''),
    'Other Interest': reg.location?.otherInterest || '',
    'State/Region': reg.location?.state || '',
    'Age Range': reg.location?.ageRange || '',
    'Expectations': reg.location?.expectations || '',
    'Created At': reg.createdAt || reg.created_at || ''
  }));

  const csv = convertToCSV(csvData, headers);
  const filename = `registrations_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(csv, filename);
}

/**
 * Export partners to CSV
 */
export function exportPartnersToCSV(partners: any[]) {
  const headers = ['Name', 'Email', 'Organization', 'Country', 'Status', 'Created At'];
  
  const csvData = partners.map(partner => ({
    'Name': partner.fullName || partner.name || '',
    'Email': partner.email || '',
    'Organization': partner.orgName || partner.organization || '',
    'Country': partner.country || '',
    'Status': partner.status || '',
    'Created At': partner.created_at || ''
  }));

  const csv = convertToCSV(csvData, headers);
  const filename = `partners_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(csv, filename);
}

/**
 * Export contacts to CSV
 */
export function exportContactsToCSV(contacts: any[]) {
  const headers = ['Name', 'Email', 'Role', 'Message', 'Status', 'IP Address', 'User Agent', 'Created At'];
  
  const csvData = contacts.map(contact => ({
    'Name': contact.name || '',
    'Email': contact.email || '',
    'Role': contact.role || '',
    'Message': contact.message || '',
    'Status': contact.status || '',
    'IP Address': contact.ip_address || '',
    'User Agent': contact.user_agent || '',
    'Created At': contact.created_at || ''
  }));

  const csv = convertToCSV(csvData, headers);
  const filename = `contacts_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(csv, filename);
}

/**
 * Export join requests to CSV
 */
export function exportJoinRequestsToCSV(joinRequests: any[]) {
  const headers = ['Name', 'Email', 'Role', 'Status', 'Created At'];
  
  const csvData = joinRequests.map(request => ({
    'Name': request.name || '',
    'Email': request.email || '',
    'Role': request.role || '',
    'Status': request.status || '',
    'Created At': request.created_at || ''
  }));

  const csv = convertToCSV(csvData, headers);
  const filename = `join_requests_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(csv, filename);
}

/**
 * Export events to CSV
 */
export function exportEventsToCSV(events: any[]) {
  const headers = ['Title', 'Description', 'Start Date', 'End Date', 'Location', 'Registration Link', 'Status', 'Created At'];
  
  const csvData = events.map(event => ({
    'Title': event.title || '',
    'Description': event.description || '',
    'Start Date': event.start_at || '',
    'End Date': event.end_at || '',
    'Location': event.location || '',
    'Registration Link': event.registration_link || '',
    'Status': event.status || '',
    'Created At': event.created_at || ''
  }));

  const csv = convertToCSV(csvData, headers);
  const filename = `events_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(csv, filename);
}

/**
 * Export blog posts to CSV
 */
export function exportBlogPostsToCSV(posts: any[]) {
  const headers = ['Title', 'Slug', 'Excerpt', 'Tags', 'Status', 'Author', 'Published At', 'Created At'];
  
  const csvData = posts.map(post => ({
    'Title': post.title || '',
    'Slug': post.slug || '',
    'Excerpt': post.excerpt || '',
    'Tags': Array.isArray(post.tags) ? post.tags.join('; ') : '',
    'Status': post.status || '',
    'Author': post.author_name || '',
    'Published At': post.published_at || '',
    'Created At': post.created_at || ''
  }));

  const csv = convertToCSV(csvData, headers);
  const filename = `blog_posts_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(csv, filename);
}

