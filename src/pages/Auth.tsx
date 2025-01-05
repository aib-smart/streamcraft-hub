import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        toast({
          title: "Welcome!",
          description: "You have successfully signed in.",
        });
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return (
    <div className="container max-w-md mx-auto mt-8 p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Yo, Welcome Back!</h1>
      <div className="bg-card p-6 rounded-lg shadow-lg">
        <SupabaseAuth 
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'rgb(0, 123, 255)',  // Blue color
                  brandAccent: 'rgb(255, 255, 255)',  // White color
                  brandButton: 'rgb(0, 123, 255)', // Blue button
                  brandButtonText: 'rgb(255, 255, 255)', // White button text
                  brandButtonHoverText: 'rgb(64, 88, 114)', // White text on hover
                  brandButtonHover: 'rgb(4, 76, 154)', // Slightly darker blue on hover
                  inputText: 'rgb(0, 0, 0)', // Black input text
                  inputBackground: 'rgb(255, 255, 255)', // White input background
                  inputBorder: 'rgb(200, 200, 200)', // Light grey input border
                  inputFocusBorder: 'rgb(0, 123, 255)', // Blue border on focus
                  inputFocusBackground: 'rgb(255, 255, 255)', // White background on focus
                  inputFocusText: 'rgb(0, 0, 0)', // Black text on focus
                  linkText: 'rgb(0, 123, 255)', // Blue text for links
                  linkTextHover: 'rgb(8, 92, 182)', // Darker blue for links on hover
                },
              },
            },
          }}
          providers={[]}
        />
      </div>
    </div>
  );
};

export default Auth;
