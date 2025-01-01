import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
      <Card>
        <CardHeader>
          <CardTitle>Privacy Policy for Pearl Mentor Hub</CardTitle>
          <CardDescription>Last updated: June 1, 2023</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            At Pearl Mentor Hub, accessible from www.pearlmentorhub.com, one of
            our main priorities is the privacy of our visitors. This Privacy
            Policy document contains types of information that is collected and
            recorded by Pearl Mentor Hub and how we use it.
          </p>
          <p>
            If you have additional questions or require more information about
            our Privacy Policy, do not hesitate to contact us.
          </p>

          <h2 className="text-2xl font-semibold mt-6">Consent</h2>
          <p>
            By using our website, you hereby consent to our Privacy Policy and
            agree to its terms.
          </p>

          <h2 className="text-2xl font-semibold mt-6">
            Information we collect
          </h2>
          <p>
            The personal information that you are asked to provide, and the
            reasons why you are asked to provide it, will be made clear to you
            at the point we ask you to provide your personal information.
          </p>
          <p>
            If you contact us directly, we may receive additional information
            about you such as your name, email address, phone number, the
            contents of the message and/or attachments you may send us, and any
            other information you may choose to provide.
          </p>
          <p>
            When you register for an Account, we may ask for your contact
            information, including items such as name, company name, address,
            email address, and telephone number.
          </p>

          <h2 className="text-2xl font-semibold mt-6">
            How we use your information
          </h2>
          <p>
            We use the information we collect in various ways, including to:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Provide, operate, and maintain our website</li>
            <li>Improve, personalize, and expand our website</li>
            <li>Understand and analyze how you use our website</li>
            <li>Develop new products, services, features, and functionality</li>
            <li>
              Communicate with you, either directly or through one of our
              partners, including for customer service, to provide you with
              updates and other information relating to the website, and for
              marketing and promotional purposes
            </li>
            <li>Send you emails</li>
            <li>Find and prevent fraud</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6">Log Files</h2>
          <p>
            Pearl Mentor Hub follows a standard procedure of using log files.
            These files log visitors when they visit websites. All hosting
            companies do this and a part of hosting services' analytics. The
            information collected by log files include internet protocol (IP)
            addresses, browser type, Internet Service Provider (ISP), date and
            time stamp, referring/exit pages, and possibly the number of clicks.
            These are not linked to any information that is personally
            identifiable. The purpose of the information is for analyzing
            trends, administering the site, tracking users' movement on the
            website, and gathering demographic information.
          </p>

          <h2 className="text-2xl font-semibold mt-6">
            Cookies and Web Beacons
          </h2>
          <p>
            Like any other website, Pearl Mentor Hub uses 'cookies'. These
            cookies are used to store information including visitors'
            preferences, and the pages on the website that the visitor accessed
            or visited. The information is used to optimize the users'
            experience by customizing our web page content based on visitors'
            browser type and/or other information.
          </p>

          {/* Add more sections as needed */}

          <h2 className="text-2xl font-semibold mt-6">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, You can contact
            us:
          </p>
          <ul className="list-disc list-inside">
            <li>By email: privacy@pearlmentorhub.com</li>
            <li>
              By visiting this page on our website:
              www.pearlmentorhub.com/contact
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
