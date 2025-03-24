import click
import requests
import json
from rich.console import Console
from rich.markdown import Markdown
from rich.panel import Panel
from rich.live import Live
from rich.spinner import Spinner

console = Console()

def send_message(message: str, api_url: str = "http://localhost:3001/api/v1/chatbot") -> dict:
    """Send a message to the chatbot API and return the response."""
    try:
        response = requests.post(
            api_url,
            json={"message": message},
            headers={"Content-Type": "application/json"}
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        console.print(f"[red]Error connecting to API: {str(e)}[/red]")
        return None

@click.group()
def cli():
    """Galaxy Assistant CLI - Interact with the AI assistant."""
    pass

@cli.command()
@click.argument('message')
def chat(message: str):
    """Send a message to the AI assistant and get a response."""
    with Live(Spinner("dots"), refresh_per_second=4) as live:
        live.update(Panel(f"[yellow]Sending message: {message}[/yellow]"))
        response = send_message(message)
        
        if response:
            console.print("\n[bold green]Assistant:[/bold green]")
            console.print(Markdown(response['response']))
        else:
            console.print("[red]Failed to get response from assistant.[/red]")

@cli.command()
def interactive():
    """Start an interactive chat session with the AI assistant."""
    console.print("[bold green]Welcome to Galaxy Assistant CLI![/bold green]")
    console.print("Type 'exit' to end the conversation.\n")
    
    while True:
        try:
            user_input = click.prompt("[bold blue]You[/bold blue]")
            
            if user_input.lower() in ['exit', 'quit']:
                console.print("\n[bold green]Goodbye![/bold green]")
                break
                
            with Live(Spinner("dots"), refresh_per_second=4) as live:
                live.update(Panel("[yellow]Thinking...[/yellow]"))
                response = send_message(user_input)
                
                if response:
                    console.print("\n[bold green]Assistant:[/bold green]")
                    console.print(Markdown(response['response']))
                else:
                    console.print("[red]Failed to get response from assistant.[/red]")
                    
        except KeyboardInterrupt:
            console.print("\n[bold green]Goodbye![/bold green]")
            break
        except Exception as e:
            console.print(f"[red]Error: {str(e)}[/red]")

if __name__ == '__main__':
    cli() 